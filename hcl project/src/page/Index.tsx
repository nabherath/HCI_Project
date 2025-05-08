import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b py-4 px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Room Design Architect</h1>
        
      </header>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-muted to-white">
        <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <div className="space-y-6">
            <h2 className="text-5xl font-extrabold text-foreground leading-tight">
              Design  Dream Room
            </h2>
            <p className="text-lg text-muted-foreground">
              Customize your space with 2D & 3D views. Drag furniture, adjust colors, and see your ideas come to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/login')}
                className="bg-primary hover:bg-secondary"
              >
                Start Designing
              </Button>
              
            </div>
          </div>

          {/* Carousel Section */}
          <div className="relative">
            <div className="absolute top-0 -left-4 w-60 h-60 bg-primary rounded-full opacity-20 filter blur-3xl animate-pulse-light" />
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-accent rounded-full opacity-20 filter blur-3xl animate-pulse-light" style={{ animationDelay: '1s' }} />
            <div className="relative z-10 bg-white p-5 rounded-xl shadow-lg border border-border animate-float">
              <Carousel className="w-full">
                <CarouselContent>
                  {[
                    { src: "/uploads/f9c84edb-5c76-4081-9d31-d71049b0e659.png", alt: "Modern living room" },
                    { src: "/uploads/d838df10-6f2b-4159-845a-8f5b9cace9be.png", alt: "Minimalist room" },
                    { src: "/uploads/cd8a8306-e85f-4d11-8cb6-1ec631186c0c.jpg", alt: "Room Design Preview" },
                  ].map((item, idx) => (
                    <CarouselItem key={idx} className="pl-0">
                      <img src={item.src} alt={item.alt} className="w-full h-60 object-cover rounded-md mb-4" />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/80 hover:bg-white" />
                <CarouselNext className="right-2 bg-white/80 hover:bg-white" />
              </Carousel>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Room Design Architect.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
