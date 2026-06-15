"use client"

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
    {
        tempId: 0,
        testimonial: "I was drowning in random PDFs. Padhobadho gave me the exact CUET-level questions I needed. Scored 780/800.",
        by: "Aditya S., SRCC '27",
        imgSrc: "https://i.pravatar.cc/150?img=1"
    },
    {
        tempId: 1,
        testimonial: "The analytics are insane. I knew exactly which Logic topics I was weak in before CLAT.",
        by: "Vikram R., NLSIU '28",
        imgSrc: "https://i.pravatar.cc/150?img=2"
    },
    {
        tempId: 2,
        testimonial: "Finally a platform that feels modern. No clutter, just high quality practice for JEE Mains.",
        by: "Rohan K., DTU '26",
        imgSrc: "https://i.pravatar.cc/150?img=3"
    },
    {
        tempId: 3,
        testimonial: "The consistency heatmap kept me going. I didn't want to break my 45-day streak!",
        by: "Sneha G., Hindu College '26",
        imgSrc: "https://i.pravatar.cc/150?img=4"
    },
    {
        tempId: 4,
        testimonial: "Padhobadho's mock tests are notoriously close to the actual exam difficulty. Big confidence booster.",
        by: "Priya M., IIM A '25",
        imgSrc: "https://i.pravatar.cc/150?img=5"
    },
    {
        tempId: 5,
        testimonial: "I love the dark mode. Studying late at night is so much easier on the eyes.",
        by: "Karthik N., IIT Delhi '27",
        imgSrc: "https://i.pravatar.cc/150?img=6"
    },
];

interface TestimonialCardProps {
    position: number;
    testimonial: typeof testimonials[0];
    handleMove: (steps: number) => void;
    cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    position,
    testimonial,
    handleMove,
    cardSize
}) => {
    const isCenter = position === 0;

    return (
        <div
            onClick={() => handleMove(position)}
            className={cn(
                "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 sm:p-8 transition-all duration-500 ease-in-out",
                isCenter
                    ? "z-10 bg-primary text-primary-foreground border-primary"
                    : "z-0 bg-card text-card-foreground border-border hover:border-primary/50 opacity-40 sm:opacity-100 scale-90 sm:scale-100"
            )}
            style={{
                width: cardSize,
                height: cardSize,
                clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
                transform: `
          translate(-50%, -50%) 
          translateX(${typeof window !== 'undefined' && window.innerWidth < 640 ? position * 40 : (cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
                boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent"
            }}
        >
            <span
                className="absolute block origin-top-right rotate-45 bg-border"
                style={{
                    right: -2,
                    top: 48,
                    width: SQRT_5000,
                    height: 2
                }}
            />
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={testimonial.imgSrc}
                    alt={`${testimonial.by.split(',')[0]}`}
                    className="h-12 w-10 bg-muted object-cover object-top"
                    style={{
                        boxShadow: "3px 3px 0px hsl(var(--background))"
                    }}
                />
                <p className={cn(
                    "text-xs font-bold italic",
                    isCenter ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                    {testimonial.by}
                </p>
            </div>
            <h3 className={cn(
                "text-sm sm:text-lg font-medium leading-snug",
                isCenter ? "text-primary-foreground" : "text-foreground"
            )}>
                "{testimonial.testimonial}"
            </h3>
        </div>
    );
};

export const StaggerTestimonials: React.FC = () => {
    const [cardSize, setCardSize] = useState(365);
    const [testimonialsList, setTestimonialsList] = useState(testimonials);

    const handleMove = (steps: number) => {
        const newList = [...testimonialsList];
        if (steps > 0) {
            for (let i = steps; i > 0; i--) {
                const item = newList.shift();
                if (!item) return;
                newList.push({ ...item, tempId: Math.random() });
            }
        } else {
            for (let i = steps; i < 0; i++) {
                const item = newList.pop();
                if (!item) return;
                newList.unshift({ ...item, tempId: Math.random() });
            }
        }
        setTestimonialsList(newList);
    };

    useEffect(() => {
        const updateSize = () => {
            const { matches } = window.matchMedia("(min-width: 640px)");
            setCardSize(matches ? 365 : 290);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden h-[450px] sm:h-[600px]"
        >
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />

            {testimonialsList.map((testimonial, index) => {
                const position = testimonialsList.length % 2
                    ? index - (testimonialsList.length + 1) / 2
                    : index - testimonialsList.length / 2;
                return (
                    <TestimonialCard
                        key={testimonial.tempId}
                        testimonial={testimonial}
                        handleMove={handleMove}
                        position={position}
                        cardSize={cardSize}
                    />
                );
            })}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 z-30">
                <button
                    onClick={() => handleMove(-1)}
                    className={cn(
                        "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
                        "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                    )}
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft />
                </button>
                <button
                    onClick={() => handleMove(1)}
                    className={cn(
                        "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
                        "bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full"
                    )}
                    aria-label="Next testimonial"
                >
                    <ChevronRight />
                </button>
            </div>
        </div>
    );
};
