// src/components/Dashboard/DashboardOverviewContent.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
    CloudIcon,
    NewspaperIcon,
    BanknotesIcon,
    CpuChipIcon,
    CodeBracketSquareIcon,
    BoltIcon,
    PuzzlePieceIcon,
    PaintBrushIcon,
    CircleStackIcon,
    RectangleStackIcon,
    ShieldCheckIcon,
    BeakerIcon,
    BookOpenIcon
} from '@heroicons/react/24/outline'; // Or solid, as you prefer

interface FeatureItem {
    text: string;
    implemented: boolean; // To show if it's done or planned
}

interface ServiceInfo {
    id: string;
    title: string;
    icon: React.ElementType;
    bgColor: string; // Tailwind background color class
    textColor: string; // Tailwind text color class
    description: string;
    apiSource: string;
    coreLibraries: { name: string; icon?: React.ElementType }[];
    features: FeatureItem[];
}

const servicesData: ServiceInfo[] = [
    {
        id: 'weather',
        title: 'Weather Insights',
        icon: CloudIcon,
        bgColor: 'bg-sky-500',
        textColor: 'text-sky-100',
        description: 'Provides real-time weather updates and forecasts based on user location or search, offering a comprehensive meteorological overview.',
        apiSource: 'OpenWeatherMap API & GeoDB Cities API',
        coreLibraries: [
            { name: 'Recharts', icon: PaintBrushIcon }, // Example icon for charting
        ],
        features: [
            { text: 'Geolocation-based weather', implemented: true },
            { text: 'City search with autocomplete', implemented: true },
            { text: 'Current weather display (temp, humidity, wind)', implemented: true },
            { text: '5-7 day forecast with temperature trends', implemented: true },
            { text: 'Interactive charts for temperature trends (using Recharts)', implemented: true },
            { text: 'Weather-based dynamic backgrounds (Planned)', implemented: false },
        ],
    },
    {
        id: 'news',
        title: 'Global News Feed',
        icon: NewspaperIcon,
        bgColor: 'bg-rose-500',
        textColor: 'text-rose-100',
        description: 'Delivers the latest news headlines from around the world, categorized and filterable, with detailed article views.',
        apiSource: 'NewsAPI.org',
        coreLibraries: [
            { name: 'Infinite Scroll', icon: BoltIcon }, 
        ],
        features: [
            { text: 'Categorized news headlines', implemented: true },
            { text: 'Filtering news by category', implemented: true },
            { text: 'Pagination / Infinite scrolling for articles', implemented: true },
            { text: 'Article cards (headline, image, summary)', implemented: true },
            { text: 'Detail view modal for full articles & external links', implemented: true },
        ],
    },
    {
        id: 'finance',
        title: 'Market Watch',
        icon: BanknotesIcon,
        bgColor: 'bg-emerald-500',
        textColor: 'text-emerald-100',
        description: 'Tracks stock market data, offering interactive charts and key metrics for user-selected symbols and various time ranges.',
        apiSource: 'Alpha Vantage API',
        coreLibraries: [
            { name: 'Lightweight Charts™', icon: PaintBrushIcon },
        ],
        features: [
            { text: 'Stock symbol search with autocomplete', implemented: true },
            { text: 'Real-time (or near real-time) stock data display', implemented: true },
            { text: 'Key metrics (price, high/low, volume, % change)', implemented: true },
            { text: 'Interactive stock charts (line & candlestick)', implemented: true },
            { text: 'Historical data analysis (1D, 1W, 1M views)', implemented: true },
            { text: 'Chart interactivity (zoom, hover details)', implemented: true },
            { text: 'Finance-based dynamic animations (Planned)', implemented: false },
        ],
    },
];

const techStackData = [
    { name: 'Next.js', category: 'Framework', icon: RectangleStackIcon, description: "React framework for server-side rendering, static site generation, and more." },
    { name: 'React', category: 'Library', icon: PuzzlePieceIcon, description: "JavaScript library for building user interfaces." },
    { name: 'TypeScript', category: 'Language', icon: CodeBracketSquareIcon, description: "Strongly typed superset of JavaScript for enhanced code quality and maintainability." },
    { name: 'Redux Toolkit & RTK Query', category: 'State Management', icon: CircleStackIcon, description: "Efficient and predictable state management with powerful data fetching and caching." },
    { name: 'Tailwind CSS', category: 'Styling', icon: PaintBrushIcon, description: "Utility-first CSS framework for rapid UI development." },
    { name: 'DaisyUI', category: 'Styling', icon: PaintBrushIcon, description: "Tailwind CSS component library for beautiful, customizable UI elements." },
    { name: 'Framer Motion', category: 'Animation', icon: BoltIcon, description: "Production-ready motion library for React." },
    { name: 'Heroicons', category: 'Assets', icon: PuzzlePieceIcon, description: "Beautiful, hand-crafted SVG icons." },
    // Add testing libraries if you list them
    // { name: 'Jest & React Testing Library', category: 'Testing', icon: BeakerIcon },
];

const DashboardOverviewContent: React.FC = () => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    const sectionVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } }
    };

    return (
        <div className="p-4 md:p-8 space-y-12 text-base-content bg-base-200 min-h-screen">
            {/* Header Section */}
            <motion.section
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="text-center p-8 rounded-xl shadow-2xl bg-gradient-to-br from-primary to-secondary"
            >
                <BookOpenIcon className="h-20 w-20 mx-auto mb-6 text-primary-content" />
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-primary-content">
                    Comprehensive Analytics Dashboard
                </h1>
                <p className="text-lg md:text-xl text-primary-content/90 max-w-3xl mx-auto">
                    An advanced front-end application showcasing data from multiple APIs,
                    interactive animations, and a high-performance user experience.
                    Built as part of the SDE1 Intern assignment for PGAGI.
                </p>
            </motion.section>

            {/* Services Section */}
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
                <h2 className="text-3xl font-bold mb-8 text-center text-accent">Implemented Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {servicesData.map((service, index) => (
                        <motion.div
                            key={service.id}
                            custom={index}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className={`card shadow-xl ${service.bgColor} transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1`}
                        >
                            <div className="card-body items-center text-center">
                                <service.icon className={`h-16 w-16 mb-4 ${service.textColor}`} />
                                <h3 className={`card-title text-2xl font-semibold ${service.textColor}`}>{service.title}</h3>
                                <p className={`${service.textColor}/80 text-sm mb-4`}>{service.description}</p>
                                <div className="badge badge-neutral mb-2 text-xs">API: {service.apiSource}</div>
                                
                                {service.coreLibraries.length > 0 && (
                                    <div className="mb-4 w-full">
                                        <h4 className={`text-sm font-semibold mb-1 ${service.textColor}/90`}>Core Libraries:</h4>
                                        <div className="flex flex-wrap justify-center gap-2">
                                        {service.coreLibraries.map(lib => (
                                            <span key={lib.name} className={`badge badge-outline text-xs ${service.textColor}/80 border-${service.textColor}/50`}>
                                                {lib.icon && <lib.icon className="h-3 w-3 mr-1 inline"/>}
                                                {lib.name}
                                            </span>
                                        ))}
                                        </div>
                                    </div>
                                )}

                                <div className="text-left w-full mt-2">
                                    <h4 className={`text-md font-semibold mb-2 ${service.textColor}/90`}>Key Features:</h4>
                                    <ul className="list-none space-y-1 text-xs">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className={`flex items-center ${service.textColor}/80`}>
                                                <span className={`mr-2 h-2 w-2 rounded-full ${feature.implemented ? 'bg-success' : 'bg-warning'}`}></span>
                                                {feature.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Tech Stack Section */}
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
                <h2 className="text-3xl font-bold mb-8 text-center text-accent">Core Technology Stack</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {techStackData.map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            custom={index + servicesData.length} // Continue stagger effect
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            className="card bg-base-100 shadow-lg hover:shadow-primary/30 transition-shadow"
                        >
                            <div className="card-body">
                                <div className="flex items-center mb-3">
                                    {tech.icon && <tech.icon className="h-8 w-8 mr-3 text-primary" />}
                                    <h3 className="card-title text-xl">{tech.name}</h3>
                                </div>
                                <span className="badge badge-ghost text-xs mb-2">{tech.category}</span>
                                <p className="text-sm text-base-content/80">{tech.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

             {/* Assignment Guidelines & Future Work (Optional) */}
            <motion.section variants={sectionVariants} initial="hidden" animate="visible" className="mt-12 text-center">
                <h2 className="text-2xl font-semibold mb-6 text-accent">Project Context</h2>
                <div className="prose prose-sm md:prose-base lg:prose-lg max-w-4xl mx-auto text-base-content/90 bg-base-100 p-6 rounded-lg shadow-md">
                    <p>
                        This dashboard was developed according to the "Advanced Front-End Development" assignment.
                        It aims to demonstrate proficiency in modern front-end technologies, complex application architecture,
                        and the creation of dynamic, user-friendly interfaces with high performance and accessibility.
                    </p>
                    
                </div>
            </motion.section>


        </div>
    );
};

export default DashboardOverviewContent;