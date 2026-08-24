'use client'
import { useState } from 'react'
import { 
  Book, 
  Code, 
  PenTool, 
  Target, 
  FileText, 
  Globe, 
  Award, 
  Brain,
  ArrowRight,
  Sparkles,
  Zap,
  TrendingUp,
  Cpu
} from 'lucide-react'
import Link from 'next/link'
import HeroSection from './dashboard/_components/HeroSection'
import TiltCard from '../components/ui/TiltCard'

const ResourceCard = ({ icon, title, description, links }) => (
  <TiltCard className="flex flex-col h-full bg-slate-900/40 border-slate-800 hover:border-indigo-500/40 transition-all duration-300">
    <div className="flex items-center mb-4">
      <div className="p-3 bg-indigo-950/50 border border-indigo-500/30 rounded-xl text-indigo-400">
        {icon}
      </div>
      <h3 className="ml-4 text-xl font-bold text-slate-100">{title}</h3>
    </div>
    <p className="text-slate-400 mb-6 flex-grow leading-relaxed">{description}</p>
    <div className="space-y-3">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          {link.name}
          <ArrowRight 
            className="ml-1 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" 
          />
        </a>
      ))}
    </div>
  </TiltCard>
)

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('tech')

  const resourceCategories = {
    tech: {
      icon: <Code className="w-6 h-6" />,
      resources: [
        {
          title: "Coding Platforms",
          description: "Sharpen your coding skills and master algorithms with leading developer practice networks.",
          icon: <Code className="w-6 h-6" />,
          links: [
            { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
            { name: "LeetCode", url: "https://leetcode.com/" },
            { name: "HackerRank", url: "https://www.hackerrank.com/" },
            { name: "CodeChef", url: "https://www.codechef.com/" }
          ]
        },
        {
          title: "Technical Prep",
          description: "Review system design architectures and solve technical interview puzzles.",
          icon: <Target className="w-6 h-6" />,
          links: [
            { name: "InterviewBit", url: "https://www.interviewbit.com/" },
            { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
            { name: "Pramp", url: "https://www.pramp.com/" }
          ]
        }
      ]
    },
    aptitude: {
      icon: <Brain className="w-6 h-6" />,
      resources: [
        {
          title: "Aptitude & Reasoning",
          description: "Excel in quantitative aptitude, logical deduction, and verbal reasoning modules.",
          icon: <PenTool className="w-6 h-6" />,
          links: [
            { name: "IndiaBix", url: "https://www.indiabix.com/" },
            { name: "Freshersworld Aptitude", url: "https://www.freshersworld.com/aptitude-questions" },
            { name: "MathsGuru Reasoning", url: "https://www.mathsguru.com/reasoning-questions/" }
          ]
        },
        {
          title: "Competitive Exam Prep",
          description: "Prepare for top placement assessments and engineering competitive papers.",
          icon: <Award className="w-6 h-6" />,
          links: [
            { name: "GATE Overflow", url: "https://gateoverflow.in/" },
            { name: "Career Power", url: "https://careerpower.in/" },
            { name: "Brilliant.org", url: "https://brilliant.org/" }
          ]
        }
      ]
    },
    interview: {
      icon: <FileText className="w-6 h-6" />,
      resources: [
        {
          title: "Interview Guides",
          description: "Learn interview frameworks, behavioral rules, and study placement patterns.",
          icon: <Book className="w-6 h-6" />,
          links: [
            { name: "Insider Tips", url: "https://www.ambitionbox.com/" },
            { name: "InterviewStreet", url: "https://www.interviewstreet.com/" },
            { name: "Career Guidance", url: "https://www.shiksha.com/" }
          ]
        },
        {
          title: "Global MOOCs",
          description: "Access industry-standard courses and specialized software engineering credentials.",
          icon: <Globe className="w-6 h-6" />,
          links: [
            { name: "Coursera", url: "https://www.coursera.org/" },
            { name: "edX", url: "https://www.edx.org/" },
            { name: "Udacity", url: "https://www.udacity.com/" }
          ]
        }
      ]
    }
  }

  const features = [
    {
      title: "Clarity Over Complexity",
      description: "Our AI helps you focus on structural improvements by breaking down answers point-by-point.",
      icon: <Cpu className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Real-Time Speech Insights",
      description: "Analyze tone, coherence, and grammar dynamically to perfect your mock answers.",
      icon: <Zap className="w-6 h-6 text-indigo-400" />
    },
    {
      title: "Progress Visualization",
      description: "Detailed metric dashboards monitor your growth rates, scores, and mock frequency.",
      icon: <TrendingUp className="w-6 h-6 text-indigo-400" />
    }
  ]

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      <HeroSection />

      {/* Value Prop Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-900 bg-slate-950/40 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-16 space-y-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Powered by Generative Intelligence
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Say goodbye to standard checklists. Interview Guru custom-tailors questions and highlights key improvements instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {features.map((feature, idx) => (
            <TiltCard 
              key={idx} 
              className="bg-slate-900/30 border-slate-800/80 hover:border-indigo-500/30 p-8 flex flex-col items-center text-center rounded-2xl"
            >
              <div className="p-4 bg-indigo-950/50 border border-indigo-500/20 rounded-2xl mb-6 text-indigo-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.description}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* Resources Explorer */}
      <section className="py-24 bg-slate-900/20 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              B.Tech Interview & Placement Assets
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Explore curated roadmaps and external preparation tools to support your academic and professional placement.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap justify-center mb-12 gap-3">
            {Object.keys(resourceCategories).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 border
                ${activeCategory === category 
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                {resourceCategories[category].icon}
                <span className="capitalize">{category}</span>
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resourceCategories[activeCategory].resources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </div>
      </section>

      {/* Extra Tips / Standout Sections */}
      <section className="py-24 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-950/30 to-purple-950/20 border border-slate-800/80 rounded-3xl p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="text-center mb-16 relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Accelerate Your Preparation
              </h2>
              <p className="text-slate-400">
                Leverage dedicated platforms to build standing credentials and stand out during engineering recruitment drives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {[
                {
                  title: "Standout Resumes",
                  description: "Use premium templates to design high-quality tech resumes.",
                  icon: <Book className="w-8 h-8 text-indigo-400" />,
                  url: "https://www.canva.com/resumes/templates/"
                },
                {
                  title: "Interactive Simulator",
                  description: "Start custom mock interviews with our AI coach right away.",
                  icon: <Target className="w-8 h-8 text-indigo-400" />,
                  url: "/dashboard"
                },
                {
                  title: "Skill Analysis",
                  description: "Identify and grade core engineering skill metrics.",
                  icon: <Brain className="w-8 h-8 text-indigo-400" />,
                  url: "https://www.skillvalue.com/"
                }
              ].map((tip, index) => (
                <TiltCard 
                  key={index} 
                  className="bg-slate-950/60 border-slate-800/60 p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-4 text-indigo-400">{tip.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{tip.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{tip.description}</p>
                  </div>
                  <a
                    href={tip.url}
                    className="inline-flex items-center text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Launch Platform
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}