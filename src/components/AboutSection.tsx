import React from 'react';
import { GraduationCap, MapPin, Compass, Target, Code2, BookOpen, Award } from 'lucide-react';
import type { About, Profile } from '../types/index.ts';

export const AboutSection: React.FC<{ about: About; profile?: Profile }> = ({ about, profile }) => {
  const college = profile?.college || about.college || about.university || '';
  const degree = profile?.degree || about.degree || about.education || '';
  const gradYear = profile?.graduationYear || about.graduationYear || '';
  const twelfthSchool = profile?.twelfthSchool || about.twelfthSchool || '';
  const twelfthPct = profile?.twelfthPercentage || about.twelfthPercentage || '';
  const tenthSchool = profile?.tenthSchool || about.tenthSchool || '';
  const tenthPct = profile?.tenthPercentage || about.tenthPercentage || '';
  const location = profile?.location || about.location || '';

  const hasEducation = Boolean(college || degree || gradYear || twelfthSchool || twelfthPct || tenthSchool || tenthPct);

  return (
    <section id="about" className="py-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <span className="text-xs font-mono text-blue-400 font-semibold tracking-wider uppercase">
            01. Background & Bio
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            About Me
          </h2>
          {about.shortBio && (
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              {about.shortBio}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Narrative */}
          <div className="lg:col-span-7 space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed">
            {about.fullBio ? (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-400" />
                  <span>Engineering Philosophy</span>
                </h3>
                <p className="whitespace-pre-line text-slate-300 leading-relaxed">
                  {about.fullBio}
                </p>
              </div>
            ) : null}

            {/* Career Goals */}
            {about.careerGoals ? (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span>Career Trajectory & Vision</span>
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {about.careerGoals}
                </p>
              </div>
            ) : null}
          </div>

          {/* Side Info Cards: Education & Location & Interests */}
          <div className="lg:col-span-5 space-y-4">
            {/* Education Box */}
            {hasEducation && (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>Academic Qualifications & Education</span>
                </h3>

                {/* Higher Education */}
                {(college || degree) && (
                  <div className="flex items-start gap-3 pt-1">
                    <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 shrink-0">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Higher Education</h4>
                      {degree && <p className="text-sm font-semibold text-white mt-0.5">{degree}</p>}
                      {college && <p className="text-xs text-slate-300 mt-0.5">{college}</p>}
                      {gradYear && (
                        <p className="text-xs font-mono text-blue-400 mt-1">Class of {gradYear}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* 12th Senior Secondary */}
                {(twelfthSchool || twelfthPct) && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 text-blue-300 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Senior Secondary (12th)</h4>
                      {twelfthSchool && <p className="text-sm font-medium text-white mt-0.5">{twelfthSchool}</p>}
                      {twelfthPct && <p className="text-xs font-mono text-blue-400 mt-0.5">Score / Percentage: {twelfthPct}</p>}
                    </div>
                  </div>
                )}

                {/* 10th High School */}
                {(tenthSchool || tenthPct) && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 text-emerald-400 shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Secondary School (10th)</h4>
                      {tenthSchool && <p className="text-sm font-medium text-white mt-0.5">{tenthSchool}</p>}
                      {tenthPct && <p className="text-xs font-mono text-blue-400 mt-0.5">Score / Percentage: {tenthPct}</p>}
                    </div>
                  </div>
                )}

                {location && (
                  <div className="pt-3 border-t border-slate-800/80 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Location</h4>
                      <p className="text-sm font-medium text-white">{location}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Core Interests */}
            {about.interests && about.interests.length > 0 && (
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-blue-400" />
                  <span>Areas of Specialization & Interest</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {about.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-slate-800/90 border border-slate-700/60 text-xs font-medium text-slate-200"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
