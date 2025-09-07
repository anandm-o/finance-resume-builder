'use client';

import { useResumeStore } from '../store/resumeStore';

export default function ResumePreview() {
  const { resume } = useResumeStore();

  const formatContact = () => {
    const parts = [
      resume.header.phone,
      resume.header.email,
      resume.header.linkedin
    ].filter(part => part && part !== '' && !part.startsWith('['));
    return parts.join(' | ');
  };

  return (
    <div className="resume-template bg-white p-8 shadow-lg" style={{
      width: '8.5in',
      minHeight: '11in',
      fontFamily: 'Times New Roman, serif',
      fontSize: '11pt',
      lineHeight: '1.0',
      margin: '0.5in 0.7in',
    }}>
      
      {/* Header */}
      <div className="text-center mb-2">
        <div className="text-lg font-bold uppercase" style={{ fontSize: '16pt' }}>
          {resume.header.name || '[Name]'}
        </div>
        <div className="mt-1">
          {formatContact() || '[Phone Number] | [Email Address] | [LinkedIn Link]'}
        </div>
      </div>

      {/* Education */}
      <div className="mb-4">
        <div className="text-sm font-bold uppercase mb-1" style={{ fontSize: '12pt' }}>
          EDUCATION
        </div>
        {resume.education.map((edu, index) => (
          <div key={index} className="mb-4">
            {/* Line 1: School and Location */}
            <div className="flex justify-between">
              <span className="font-semibold">{edu.school || '[University Name]'}</span>
              <span>{edu.location || '[City], [Province/State/Country]'}</span>
            </div>
            
            {/* Line 2: Degree and Graduation */}
            <div className="flex justify-between">
              <span>{edu.degree || 'Bachelor of [Arts/Science] in [Major]'}</span>
              <span>{edu.graduationYear || 'Class of [Graduation Year]'}</span>
            </div>
            
            {/* Bullets */}
            {edu.gpa && (
              <div className="mt-1">
                <span>• GPA: {edu.gpa}</span>
              </div>
            )}
            {edu.awards && edu.awards.length > 0 && (
              <div>
                <span>• Honours/Awards: {edu.awards.join(', ')}</span>
              </div>
            )}
            {edu.coursework && edu.coursework.length > 0 && (
              <div>
                <span>• Competitions/Relevant Coursework: {edu.coursework.join(', ')}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Employment Experience */}
      <div className="mb-4">
        <div className="text-sm font-bold uppercase mb-1" style={{ fontSize: '12pt' }}>
          EMPLOYMENT EXPERIENCE
        </div>
        {resume.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            {/* Line 1: Company and Location */}
            <div className="flex justify-between">
              <span className="font-semibold">{exp.company || '[Company Name]'}</span>
              <span>{exp.location || '[City], [Province/State/Country]'}</span>
            </div>
            
            {/* Line 2: Title and Dates */}
            <div className="flex justify-between">
              <span>{exp.title || '[Position Title]'}</span>
              <span>{exp.startDate && exp.endDate ? `${exp.startDate} – ${exp.endDate}` : '[Start Date] – [End Date]'}</span>
            </div>
            
            {/* Bullets */}
            <div className="mt-1">
              {exp.bullets.map((bullet, bIndex) => (
                <div key={bIndex} className="mb-1">
                  <span>• {bullet.text}</span>
                </div>
              ))}
              
              {/* Selected Projects */}
              {exp.selectedProjects && exp.selectedProjects.length > 0 && (
                <div className="ml-4">
                  {exp.selectedProjects.map((project, pIndex) => (
                    <div key={pIndex} className="mb-2">
                      <div className="mb-1">
                        <span>o {project.name}</span>
                      </div>
                      <div className="ml-4">
                        <span>§ {project.action}</span>
                      </div>
                      {pIndex < exp.selectedProjects!.length - 1 && <div className="mb-2"></div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Extra-Curricular Experience */}
      <div className="mb-4">
        <div className="text-sm font-bold uppercase mb-1" style={{ fontSize: '12pt' }}>
          EXTRA-CURRICULAR EXPERIENCE
        </div>
        {resume.extraCurricular.map((extra, index) => (
          <div key={index} className="mb-4">
            {/* Line 1: Organization and Location */}
            <div className="flex justify-between">
              <span className="font-semibold">{extra.organization || '[Student Club Name]'}</span>
              <span>{extra.location || '[City], [Province/State/Country]'}</span>
            </div>
            
            {/* Line 2: Role and Dates */}
            <div className="flex justify-between">
              <span>{extra.role || '[Position Title]'}</span>
              <span>{extra.startDate && extra.endDate ? `${extra.startDate} – ${extra.endDate}` : '[Start Date] – [End Date]'}</span>
            </div>
            
            {/* Bullets */}
            <div className="mt-1">
              {extra.bullets.map((bullet, bIndex) => (
                <div key={bIndex} className="mb-1">
                  <span>• {bullet}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skills, Activities & Interests */}
      <div className="mb-4">
        <div className="text-sm font-bold uppercase mb-1" style={{ fontSize: '12pt' }}>
          SKILLS, ACTIVITIES & INTERESTS
        </div>
        
        {/* Skills Line */}
        <div className="mb-1">
          <span className="font-semibold">Skills:</span> {
            [
              ...(resume.skills.technical || []),
              ...(resume.skills.financeTools || []),
              ...(resume.skills.languages || []),
              ...(resume.skills.programming || [])
            ].filter(Boolean).join(', ') || 
            '[Languages – Fluent/Conversational Proficiency], [Programming languages], [Certifications]'
          }
        </div>
        
        {/* Activities Line */}
        <div className="mb-1">
          <span className="font-semibold">Activities:</span> {
            resume.activities.length > 0 
              ? resume.activities.join(', ')
              : 'Student Clubs, Volunteer Work, Independent Activities'
          }
        </div>
        
        {/* Interests Line */}
        <div className="mb-1">
          <span className="font-semibold">Interests:</span> {
            resume.interests.length > 0 
              ? resume.interests.join(', ')
              : 'Keep this to 1-2 lines and be specific, hobbies and interests; do not go overboard'
          }
        </div>
      </div>
    </div>
  );
}