<Query Kind="Program">
  <NuGetReference Version="11.9.0">FluentValidation</NuGetReference>
  <NuGetReference>Swashbuckle.AspNetCore</NuGetReference>
  <NuGetReference>Swashbuckle.AspNetCore.Swagger</NuGetReference>
  <NuGetReference>Swashbuckle.AspNetCore.SwaggerUI</NuGetReference>
  <Namespace>Microsoft.AspNetCore.Authentication</Namespace>
  <Namespace>Microsoft.AspNetCore.Authentication.Cookies</Namespace>
  <Namespace>Microsoft.AspNetCore.Builder</Namespace>
  <Namespace>Microsoft.AspNetCore.Http</Namespace>
  <Namespace>Microsoft.AspNetCore.Http.Features</Namespace>
  <Namespace>Microsoft.AspNetCore.Http.Features.Authentication</Namespace>
  <Namespace>Microsoft.AspNetCore.Mvc</Namespace>
  <Namespace>Microsoft.AspNetCore.Mvc.Filters</Namespace>
  <Namespace>Microsoft.Extensions.Caching.Memory</Namespace>
  <Namespace>Microsoft.Extensions.DependencyInjection</Namespace>
  <Namespace>Microsoft.Extensions.Hosting</Namespace>
  <Namespace>System.Security.Claims</Namespace>
  <Namespace>System.Text.Json</Namespace>
  <Namespace>System.Text.Json.Serialization</Namespace>
  <Namespace>System.Threading.Channels</Namespace>
  <Namespace>System.Threading.Tasks</Namespace>
  <Namespace>FluentValidation</Namespace>
  <Namespace>FluentValidation.Results</Namespace>
  <IncludeAspNet>true</IncludeAspNet>
</Query>

void Main()
{
	var builder = WebApplication.CreateBuilder();
	builder.Services.AddCors(x => x.AddDefaultPolicy(b => b.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));
	builder.Services.AddSingleton<List<Resource>>(new List<Resource>());
	var app = builder.Build();

	app.MapGet("", ([FromServices] List<Resource> list) => Results.Ok(list));

	app.MapPut("", async ([FromBody] Resource resource, [FromServices] List<Resource> list, CancellationToken ct) =>
	{
		var exists = list.Exists(x => x.Id == resource.Id);
		if(exists)
		{
			return Results.Conflict("Resource exists");
		}
		
		await Task.Delay(3000, ct);
		Console.WriteLine("Here");
		list.Add(resource);
		return Results.Ok(resource);
	});

	app.UseCors();
	 app.Run();
}

public class Resource
{
	public int Id { get; set; }
}
