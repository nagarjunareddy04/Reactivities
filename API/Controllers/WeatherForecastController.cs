using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public string Get()
    {
        FacebookApi facebookApi = new FacebookApi();
        return facebookApi.ConversionApi();
    }
}

public class FacebookApi 
    { 
        public string ConversionApi() 
        { 
            string token = "EAAFKQT3gTq0BAEbeSgZCVqadPZAUfZBTczhfavSueZAzzhiDJkdoRwOdzmPde3jfLj6a3iIbfBEaWZADr8vNVpbsM5ifcPSvrBN6M77Ull1mI6oY63U6FK7KOst5JZAe1s2LWwoU7lSGQFkDfeaYQDuT4XSROyutIGubC8xtLFSUZCBN1z0TZCZCL"; 
            HttpClient httpClient = new HttpClient(); 
            httpClient.BaseAddress = new Uri("https://graph.facebook.com/v12.0/381900942448042/events"); 
            httpClient.DefaultRequestHeaders.Accept.Clear(); 
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json")); 
            //httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token); 
            httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
            var fbData = new 
            { 
                data = new[] 
                { 
                    new 
                    { 
                        event_name="CompleteRegistration", 
                        event_time = "1674482442", 
                        event_id = "202201231419", 
                        action_source = "website", 
                        event_source_url = "http://www.provident.ro",  
                        ////client_ip_address = "192.19.9.9", 
                        ////client_user_agent = "test ua", 
                        user_data = new 
                        { 
                            ln = new string[] {GenerateSHA256("Avula")}, 
                            fn = new string[] {GenerateSHA256("Venkata") }, 
                            em = new string[] {GenerateSHA256("nagarjunareddy04@gmail.com") }, 
                            ph = new string[] {GenerateSHA256("131313131") } 
                            ////ln = GenerateSHA256("Avula"), 
                            ////fn = GenerateSHA256("Venkata"), 
                            ////em = GenerateSHA256("nagarjunareddy04@gmail.com"), 
                            ////ph = GenerateSHA256("131313131") 
                        }, 
                        ////custom_data = new 
                        ////{ 
                        ////    currency= "USD", 
                        ////    value= "142.52" 
                        ////} 
                    } 
                } 
            }; 
            ////var postResponse = httpClient.PostAsJsonAsync("https://graph.facebook.com/v12.0/381900942448042/events", fbData); 
            var content = new StringContent(JsonSerializer.Serialize(fbData), Encoding.UTF8, "application/json"); 
            var httpresponse = httpClient.PostAsJsonAsync(httpClient.BaseAddress.ToString(), fbData).Result; 
            //var httpresponse = httpClient.PostAsync(httpClient.BaseAddress.ToString(), content).Result; 
            //Console.WriteLine(httpresponse.ToString()); 

            return httpresponse.ToString();
        } 
        private string GenerateSHA256(string input) 
        { 
            var bytes = Encoding.UTF8.GetBytes(input); 
            using (var hashEngine = SHA256.Create()) 
            { 
                var hashedBytes = hashEngine.ComputeHash(bytes, 0, bytes.Length); 
                var sb = new StringBuilder(); 
                foreach (var b in hashedBytes) 
                { 
                    var hex = b.ToString("x2"); 
                    sb.Append(hex); 
                } 
                return sb.ToString(); 
            } 
        } 
    }
