var builder = DistributedApplication.CreateBuilder(args);

var server = builder
    .AddProject<Projects.AspireNextTemplate_Server>("server")
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();

var apiEndpoint = server.GetEndpoint("http");

var webfrontend = builder
    .AddNextJsApp("webfrontend", "../frontend")
    .WithPnpm()
    .WithEnvironment("API_URL", apiEndpoint)
    .WithExternalHttpEndpoints();

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
