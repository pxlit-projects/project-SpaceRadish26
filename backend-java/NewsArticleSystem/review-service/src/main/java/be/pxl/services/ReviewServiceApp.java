package be.pxl.services;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Hello world!
 *
 */
@SpringBootApplication
@EnableDiscoveryClient
public class ReviewServiceApp
{
    public static void main( String[] args )
    {

        SpringApplication.run(ReviewServiceApp.class, args);
    }
}
