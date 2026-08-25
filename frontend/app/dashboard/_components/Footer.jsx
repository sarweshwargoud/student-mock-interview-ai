import React from "react";
import { CopyrightIcon, Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-900">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Copyright Section */}
        <div className="flex items-center text-sm">
          <CopyrightIcon className="mr-2 h-5 w-5 text-gray-400" />
          <span>{new Date().getFullYear()} Interview Guru. Created by Sarweshwar Buddolla. All Rights Reserved.</span>
        </div>



        {/* Social Media Links */}
        <div className="flex space-x-4">
          <a
            href="https://github.com/sarweshwargoud/student-mock-interview-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-6 w-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/sarweshwar-buddolla-25673b312/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-6 w-6" />
          </a>
          <a
            href="https://x.com/sarweshwar_445"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-500 transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
