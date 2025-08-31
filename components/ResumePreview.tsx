'use client';

import { useResumeStore } from '../store/resumeStore';

export default function ResumePreview() {
  const { resume } = useResumeStore();

  const formatContact = () => {
    const parts = [
      resume.header.phone,
      resume.header.email,
      resume.header.linkedin
    ].filter(Boolean);
    return parts.join(' | ');
  };

  const formatEducation = (edu: any) => {
    const parts = [
      edu.school,
      edu.location
    ].filter(Boolean);
    
    const degreeParts = [
      edu.degree,
      'in',
      edu.major
    ].filter(Boolean);
    
    const additionalParts = [
      edu.gpa && `GPA: ${edu.gpa}`,
      edu.awards?.join('; '),
      edu.coursework?.length > 0 && `Competitions/Relevant Coursework: ${edu.coursework.join(' / ')}`
    ].filter(Boolean);
    
    return {
      schoolLine: parts.join(' — '),
      degreeLine: degreeParts.join(' '),
      graduationYear: `Class of ${edu.graduationYear}`,
      additionalLine: additionalParts.join('; ')
    };
  };

  const formatExperience = (exp: any) => {
    const headerParts = [
      exp.company,
      exp.location
    ].filter(Boolean);
    
    const titleParts = [
      exp.title,
      exp.groupName && exp.groupName
    ].filter(Boolean);
    
    return {
      companyLine: headerParts.join(' — '),
      titleLine: titleParts.join(', '),
      summary: exp.summary
    };
  };

  const formatLeadership = (lead: any) => {
    const headerParts = [
      lead.organization,
      lead.location
    ].filter(Boolean);
    
    return {
      orgLine: headerParts.join(' — '),
      roleLine: lead.role,
      dates: `${lead.startDate} - ${lead.endDate}`
    };
  };

  const formatSkills = () => {
    const skillsParts = [
      resume.skills.languages?.length > 0 && `${resume.skills.languages.join(' - Fluent/Conversational Proficiency')}`,
      resume.skills.programming?.join(', '),
      resume.certifications?.map(c => c.name).join(', ')
    ].filter(Boolean);
    
    const activitiesParts = [
      ...resume.activities,
      'Student Clubs, Volunteer Work, Independent Activities'
    ].filter(Boolean);
    
    return {
      skills: skillsParts.join(', '),
      activities: activitiesParts.join(', '),
      interests: resume.interests.join(', ')
    };
  };

  return (
    <div className="resume-template">
      {/* Header */}
      <div className="resume-name text-center">
        {resume.header.name || '[Name]'}
      </div>
      
      <div className="resume-contact text-center">
        {formatContact() || '[Phone Number] | [Email Address] | [LinkedIn Link]'}
      </div>

      {/* Education */}
      {resume.education.length > 0 && (
        <div className="section-content">
          <div className="resume-section-title">EDUCATION</div>
          <hr className="border-t border-black mb-3" />
          {resume.education.map((edu, index) => {
            const formatted = formatEducation(edu);
            return (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">{formatted.schoolLine}</div>
                    <div className="mb-1">{formatted.degreeLine}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{formatted.graduationYear}</div>
                  </div>
                </div>
                {formatted.additionalLine && (
                  <div className="text-sm mt-2">
                    {formatted.additionalLine}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Employment Experience */}
      {resume.experience.length > 0 && (
        <div className="section-content">
          <div className="resume-section-title">EMPLOYMENT EXPERIENCE</div>
          <hr className="border-t border-black mb-3" />
          {resume.experience.map((exp, index) => {
            const formatted = formatExperience(exp);
            return (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">{formatted.companyLine}</div>
                    <div className="mb-2">{formatted.titleLine}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{exp.startDate} - {exp.endDate}</div>
                  </div>
                </div>
                
                {formatted.summary && (
                  <div className="resume-bullet mb-2">{formatted.summary}</div>
                )}
                
                {exp.selectedProjects && exp.selectedProjects.length > 0 && (
                  <div className="selected-experience">
                    <div className="resume-bullet mb-2">
                      Selected {resume.meta.roleTarget.includes('Banking') ? 'Client / Project / Transaction' : 'Project'} Experience:
                    </div>
                    {exp.selectedProjects.map((project, pIndex) => (
                      <div key={pIndex} className="project-item ml-8 mb-2">
                        <div className="project-name">{project.name}</div>
                        <div className="ml-4 resume-sub-bullet">
                          {project.action} → {project.result}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {exp.bullets.map((bullet, bIndex) => (
                  <div key={bIndex} className="resume-bullet">
                    {bullet.text}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Extra-Curricular Experience */}
      {resume.leadership.length > 0 && (
        <div className="section-content">
          <div className="resume-section-title">EXTRA-CURRICULAR EXPERIENCE</div>
          <hr className="border-t border-black mb-3" />
          {resume.leadership.map((lead, index) => {
            const formatted = formatLeadership(lead);
            return (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold">{formatted.orgLine}</div>
                    <div className="mb-2">{formatted.roleLine}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{formatted.dates}</div>
                  </div>
                </div>
                {lead.bullets.map((bullet, bIndex) => (
                  <div key={bIndex} className="resume-bullet">
                    {bullet.text}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="section-content">
          <div className="resume-section-title">PROJECTS</div>
          <hr className="border-t border-black mb-3" />
          {resume.projects.map((project, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-semibold">{project.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{project.startDate} - {project.endDate}</div>
                </div>
              </div>
              {project.bullets.map((bullet, bIndex) => (
                <div key={bIndex} className="resume-bullet">
                  {bullet.text}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Skills, Activities & Interests */}
      <div className="section-content">
        <div className="resume-section-title">SKILLS, ACTIVITIES & INTERESTS</div>
        <hr className="border-t border-black mb-3" />
        {(() => {
          const formatted = formatSkills();
          return (
            <>
              {formatted.skills && (
                <div className="skills-section">
                  <span className="font-semibold">Skills:</span> {formatted.skills}
                </div>
              )}
              {formatted.activities && (
                <div className="skills-section">
                  <span className="font-semibold">Activities:</span> {formatted.activities}
                </div>
              )}
              {formatted.interests && (
                <div className="skills-section">
                  <span className="font-semibold">Interests:</span> {formatted.interests}
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Deals/Transactions */}
      {resume.deals.length > 0 && (
        <div className="section-content">
          <div className="resume-section-title">DEALS & TRANSACTIONS</div>
          <hr className="border-t border-black mb-3" />
          {resume.deals.map((deal, index) => (
            <div key={index} className="mb-4">
              <div className="font-semibold">
                {deal.type} — {deal.size} — {deal.role}
              </div>
              <div className="resume-bullet">
                {deal.tasks.join('; ')}; {deal.outcome}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div className="section-content">
          <div className="resume-section-title">CERTIFICATIONS</div>
          <hr className="border-t border-black mb-3" />
          {resume.certifications.map((cert, index) => (
            <div key={index} className="mb-2">
              {cert.name} — {cert.issuer} ({cert.date})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
