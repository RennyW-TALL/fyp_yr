import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, ShieldCheck, HeartPulse, Activity } from 'lucide-react';
import { SDG_INFO } from '../constants';

const Landing = () => {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-2 text-center animate-pulse">
        <p className="text-sm font-medium">🌟 Welcome to MindCare APU - Your Mental Health Companion 🌟</p>
      </div>

      {/* Hero Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-brand-600" />
                <span className="text-xl font-bold text-slate-900">MindCare APU</span>
            </div>
            <div className="flex items-center gap-4">
                <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                    Login / Register
                </Link>
            </div>
        </nav>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-medium mb-6">
                APU Final Year Project 2024
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                Cloud-Based Mental Healthcare <br className="hidden md:block"/> Platform testing
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                A secure, role-based platform bridging the gap between students and professional counseling through ethical AI screening and streamlined appointment management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="px-8 py-3 bg-brand-600 text-white rounded-xl font-semibold shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all transform hover:-translate-y-0.5">
                    Get Started
                </Link>
                <Link to="/login" className="px-8 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                    Login
                </Link>
            </div>
        </div>
      </div>



      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                    <Activity className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Early Detection</h3>
                <p className="text-slate-600 leading-relaxed">
                    AI-driven conversations to identify early signs of stress and burnout using NLP, guiding students to appropriate resources.
                </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
                    <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{SDG_INFO.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                    Directly aligned with UN SDG 3 Target 3.4 to promote mental health and well-being within the university community.
                </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Ethical & Secure</h3>
                <p className="text-slate-600 leading-relaxed">
                    Prioritizing student privacy with role-based access control. Not a clinical diagnostic tool, but a supportive bridge to care.
                </p>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
                <p className="font-semibold text-white">Asia Pacific University (APU)</p>
                <p className="text-sm">BSc (Hons) in Information Technology (Cloud Engineering)</p>
            </div>
            <div className="text-sm text-center md:text-right">
                <p>FYP Investigation Report - Part 1</p>
                <p>&copy; 2024 MindCare Project. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;