using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Microsoft.Extensions.Logging;
using Application.Core;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly ILogger<List> _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {
                    // // for (int i = 0; i < 10; i++)
                    // // {
                    // //     cancellationToken.ThrowIfCancellationRequested();
                    // //     await Task.Delay(1000, cancellationToken);
                    // //     _logger.LogInformation($"Task {i} has completed");
                    // // }
                }
                catch(Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation($"Task was cancelled");
                }

                var activities = await _context.Activities
                                        .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                                        //.Include(a => a.Attendees)
                                        //.ThenInclude(u => u.AppUser)
                                        .ToListAsync(cancellationToken);

                ////var activitiesToReturn = _mapper.Map<List<ActivityDto>>(activities);
                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}