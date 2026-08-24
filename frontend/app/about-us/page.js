'use client'
import { useState } from 'react'
import { 
  Users, 
  Target, 
  Award, 
  Briefcase, 
  BookOpen, 
  Rocket 
} from 'lucide-react'
import TiltCard from '../../components/ui/TiltCard'

const AboutUsPage = () => {
  const [activeTab, setActiveTab] = useState('mission')

  const tabContent = {
    mission: {
      icon: <Target className="mr-2 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-base md:text-lg text-slate-300">Interview Guru is on a mission to revolutionize interview preparation by providing personalized, intelligent AI coaching tailored to individual career aspirations.</p>
          <p className="text-base md:text-lg text-slate-300">With Interview Guru, the goal is to bridge the gap between preparation and success, empowering users to unlock their full potential.</p>
        </div>
      )
    },
    story: {
      icon: <BookOpen className="mr-2 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-base md:text-lg text-slate-300">The idea for Interview Guru was born from firsthand experiences with the challenges of interview preparation. As a solo developer, I wanted to create a platform that simplifies the process and builds confidence in individuals.</p>
          <p className="text-base md:text-lg text-slate-300">This journey has been a testament to the power of passion and innovation, leading to the creation of an impactful tool for career growth.</p>
        </div>
      )
    },
    approach: {
      icon: <Rocket className="mr-2 text-indigo-400" />,
      content: (
        <div className="space-y-4">
          <p className="text-base md:text-lg text-slate-300">Interview Guru leverages advanced AI algorithms to generate dynamic, contextually relevant interview questions based on your professional background and goals.</p>
          <p className="text-base md:text-lg text-slate-300">Through real-time analysis and feedback, the platform provides actionable insights, enabling users to improve with every mock interview attempt.</p>
        </div>
      )
    }
  }

  const coreValues = [
    {
      icon: <Award className="w-12 h-12 text-indigo-400 mb-4" />,
      title: "Continuous Learning",
      description: "Always striving to improve and provide better tools for growth."
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-400 mb-4" />,
      title: "Empowerment",
      description: "Supporting individuals in building confidence and achieving professional success."
    },
    {
      icon: <Briefcase className="w-12 h-12 text-indigo-400 mb-4" />,
      title: "Excellence",
      description: "Delivering high-quality, impactful features to simplify interview preparation."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-400 tracking-tight leading-tight">
            About Interview Guru
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg md:text-xl text-slate-400">
            Empowering professionals to ace interviews through intelligent, personalized AI coaching
          </p>
        </div>

        {/* Tabs Section */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden mb-16 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row border-b border-slate-800">
            {Object.keys(tabContent).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full sm:flex-1 py-4 px-6 flex items-center justify-center font-bold transition-all duration-300
                  ${activeTab === tab 
                    ? 'bg-slate-900 text-indigo-400 border-b-2 border-indigo-500' 
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-white'}`}
              >
                {tabContent[tab].icon}
                <span>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </span>
              </button>
            ))}
          </div>
          <div className="p-8 md:p-12">
            {tabContent[activeTab].content}
          </div>
        </div>

        {/* Values Section */}
        <div className="p-8 md:p-12 border border-slate-800/80 bg-slate-900/20 rounded-3xl backdrop-blur-md">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-slate-100 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <TiltCard 
                key={index} 
                className="text-center bg-slate-950/60 border-slate-800/60 p-8 rounded-2xl flex flex-col items-center"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-slate-100 mb-3">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{value.description}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage