import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import companies from "../data/companies.json";
import faq from "../data/faq.json";
import Autoplay from 'embla-carousel-autoplay';


const LandingPage = () => {
  return (
    <main className="flex flex-col justify-center min-h-screen gap-10 sm:gap-20 py-10 sm:py-20 px-4 sm:px-16">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl leading-tight tracking-tighter py-4">
          Find your Dream Job <span>and get HIRED</span>
        </h1>
        <p className="text-gray-500 sm:mt-4  text-xs sm:text-xl">
          Join the best job platform and take your career to the next level.
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        <Link to="/jobs">
          <Button variant="blue" size="xl">
            Find Jobs
          </Button>
        </Link>
        <Link to="/post-job">
          <Button variant="destructive" size="xl">
            Post a Job
          </Button>
        </Link>
      </div>

      {/* carousel */}
      <Carousel plugins={[Autoplay({ delay: 2000 })]} className="w-full py-10 ">
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* banner */}
      <img src="/banner1.jpg" className="w-full h-50%"></img>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">For Job Seeker</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Find your dream job with ease. Explore thousands of job listings
              tailored to your skills and interests.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Post your job openings and connect with top talent. Streamline
              your hiring process with our platform.
            </p>
          </CardContent>
        </Card>
      </section>

      <Accordion type="single" collapsible>
        {faq.map((faq, index) => { return (
        <AccordionItem key = {index} value={`item-${index+1}`} >
        <AccordionTrigger>{faq.question}</AccordionTrigger>
        <AccordionContent>
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
        );
      })}
      </Accordion>
    </main>
  );
}

export default LandingPage
