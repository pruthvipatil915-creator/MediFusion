package com.medai.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI medifusionOpenAPI() {

        return new OpenAPI()

                .info(new Info()
                        .title("MediFusion API")
                        .description("AI Powered Disease Prediction System with Personalized Healthcare")
                        .version("1.0")

                        .contact(new Contact()
                                .name("Pruthviraj Patil")
                                .email("your-email@example.com"))

                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))

                .externalDocs(new ExternalDocumentation()
                        .description("Project Documentation")
                        .url("https://github.com/your-github"));
    }
}