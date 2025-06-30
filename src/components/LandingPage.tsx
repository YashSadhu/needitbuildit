import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PenTool, 
  Clock, 
  Grid3X3, 
  List, 
  BarChart3, 
  Edit3, 
  Download, 
  FileText, 
  Settings,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Users,
  Star,
  ChevronDown,
  Mail
} from 'lucide-react';
import { ContainerScroll } from './ui/container-scroll-animation';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Timeline Visualization",
      description: "Organize your story events chronologically with intuitive timeline views and drag-and-drop reordering."
    },
    {
      icon: <Grid3X3 className="w-6 h-6" />,
      title: "Hierarchical Organization",
      description: "Structure your narrative with acts, chapters, and custom groups for complex storytelling."
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Research & Notes",
      description: "Keep all your world-building, character notes, and research in one organized space."
    },
    {
      icon: <Edit3 className="w-6 h-6" />,
      title: "Rich Metadata",
      description: "Track characters, locations, POV, tags, and custom fields for detailed story planning."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Export Options",
      description: "Export your timeline as JSON, PDF, or TXT files for sharing and backup."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Smart Organization",
      description: "Intelligent tools that adapt to your writing style and help streamline your creative process."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Fantasy Author",
      content: "This tool transformed how I plan my multi-book series. The timeline view helps me track complex character arcs across different storylines.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Screenwriter",
      content: "Perfect for screenplay planning. The hierarchical structure makes it easy to organize acts and scenes while maintaining the big picture.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Indie Author",
      content: "The research notes feature is a game-changer. I can keep all my world-building details organized and easily accessible.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Bolt Badge - Fixed Top Right Corner */}
      <div className="fixed top-4 right-4 z-50">
        <a 
          href="https://bolt.new/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block hover:scale-110 transition-transform duration-200"
          title="Powered by Bolt"
        >
          <img 
            src="/black_circle_360x360 copy copy copy.png" 
            alt="Powered by Bolt" 
            className="w-12 h-12 drop-shadow-lg"
          />
        </a>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Storytelling Timeline</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                Features
              </button>
              <button className="text-gray-600 hover:text-gray-900 font-medium">
                About
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:networks.yash@gmail.com" 
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  networks.yash@gmail.com
                </a>
              </div>
              <button
                onClick={onGetStarted}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Scroll Animation */}
      <div className="pt-20">
        <ContainerScroll
          titleComponent={
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                The Writer's Creative Companion
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight"
              >
                Craft Stories That
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Captivate Readers
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
              >
                Transform scattered ideas into compelling narratives. The intuitive timeline system that helps 
                authors, screenwriters, and storytellers bring their creative visions to life.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <button
                  onClick={onGetStarted}
                  className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Begin Your Story
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={onGetStarted}
                  className="flex items-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors font-semibold text-lg"
                >
                  See It In Action
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          }
        >
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
            {/* Mock Application Interface */}
            <div className="absolute inset-0 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <PenTool className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">The Dragon's Legacy</h3>
                    <p className="text-gray-400 text-sm">15 scenes • 3 acts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
              </div>

              {/* Timeline Cards */}
              <div className="space-y-4">
                {[
                  { title: "The Ancient Prophecy", time: "Opening", color: "bg-blue-500" },
                  { title: "The Chosen One Awakens", time: "Act I", color: "bg-purple-500" },
                  { title: "Journey Through Shadowlands", time: "Act II", color: "bg-green-500" },
                  { title: "The Final Confrontation", time: "Climax", color: "bg-red-500" }
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className={`w-3 h-3 rounded-full ${card.color}`}></div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{card.title}</h4>
                      <p className="text-gray-400 text-sm">{card.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-gray-400" />
                      <BarChart3 className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </ContainerScroll>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to Craft Your Masterpiece
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From the spark of inspiration to the final draft, our comprehensive toolkit supports every stage of your creative journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer"
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Storytellers Love Our Platform
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: <Zap className="w-6 h-6" />,
                    title: "Unleash Creativity",
                    description: "Focus on storytelling while our tools handle the organization and structure."
                  },
                  {
                    icon: <Shield className="w-6 h-6" />,
                    title: "Your Stories, Your Control",
                    description: "Complete creative freedom with tools that adapt to your unique writing process."
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Join the Community",
                    description: "Connect with fellow storytellers who've transformed their creative workflow."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Creative Progress</h3>
                    <p className="text-gray-600 text-sm">Track your storytelling journey</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { label: "Story Structure", progress: 100, color: "bg-green-500" },
                    { label: "Character Arcs", progress: 85, color: "bg-blue-500" },
                    { label: "World Building", progress: 70, color: "bg-purple-500" },
                    { label: "Plot Development", progress: 60, color: "bg-orange-500" }
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-700">{item.label}</span>
                        <span className="text-gray-500">{item.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          viewport={{ once: true }}
                          className={`h-2 rounded-full ${item.color}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by Storytellers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what creators are saying about Storytelling Timeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Bring Your Stories to Life?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of storytellers who've discovered the joy of organized creativity. 
              Start crafting your next masterpiece today - completely free.
            </p>
            <button
              onClick={onGetStarted}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Start Creating Today
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Storytelling Timeline</span>
            </div>
            
            <div className="flex items-center gap-6 text-gray-400">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Support</button>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a 
                  href="mailto:networks.yash@gmail.com" 
                  className="hover:text-white transition-colors"
                >
                  networks.yash@gmail.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-800 pt-8">
            <p className="text-gray-400 mb-4 md:mb-0">
              Crafted by storyteller for storytellers and visionaries © 2025 needitbuildit
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};