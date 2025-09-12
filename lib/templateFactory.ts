import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet,
  Font,
  Image
} from '@react-pdf/renderer';
import { TemplateComponent, ResumeData } from '../types/template';

// Register fonts if needed
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2', fontWeight: 'bold' },
  ],
});

export class TemplateFactory {
  private static createStyles(globalStyles: Record<string, any>) {
    return StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Roboto',
        fontSize: 10,
        lineHeight: 1.4,
        ...globalStyles.page,
      },
      header: {
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
        ...globalStyles.header,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 5,
        ...globalStyles.name,
      },
      contact: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 2,
        ...globalStyles.contact,
      },
      section: {
        marginBottom: 15,
        ...globalStyles.section,
      },
      sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        ...globalStyles.sectionTitle,
      },
      experienceItem: {
        marginBottom: 12,
        ...globalStyles.experienceItem,
      },
      experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        ...globalStyles.experienceHeader,
      },
      jobTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1f2937',
        ...globalStyles.jobTitle,
      },
      company: {
        fontSize: 11,
        color: '#2563eb',
        fontWeight: 'bold',
        ...globalStyles.company,
      },
      duration: {
        fontSize: 10,
        color: '#6b7280',
        fontStyle: 'italic',
        ...globalStyles.duration,
      },
      location: {
        fontSize: 10,
        color: '#6b7280',
        ...globalStyles.location,
      },
      description: {
        fontSize: 10,
        color: '#374151',
        marginTop: 4,
        ...globalStyles.description,
      },
      achievements: {
        marginTop: 4,
        ...globalStyles.achievements,
      },
      achievementItem: {
        fontSize: 9,
        color: '#374151',
        marginLeft: 10,
        marginBottom: 2,
        ...globalStyles.achievementItem,
      },
      educationItem: {
        marginBottom: 10,
        ...globalStyles.educationItem,
      },
      degree: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#1f2937',
        ...globalStyles.degree,
      },
      institution: {
        fontSize: 10,
        color: '#2563eb',
        ...globalStyles.institution,
      },
      skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        ...globalStyles.skillsContainer,
      },
      skillCategory: {
        marginBottom: 8,
        ...globalStyles.skillCategory,
      },
      skillCategoryTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
        ...globalStyles.skillCategoryTitle,
      },
      skillItems: {
        fontSize: 9,
        color: '#374151',
        ...globalStyles.skillItems,
      },
      spacer: {
        height: 10,
        ...globalStyles.spacer,
      },
    });
  }

  private static renderComponent(
    component: TemplateComponent, 
    data: ResumeData, 
    styles: any
  ): React.ReactElement {
    const { type, props, children, styles: componentStyles } = component;

    switch (type) {
      case 'text':
        return (
          <Text style={[styles[props.styleKey], componentStyles]}>
            {props.content}
          </Text>
        );

      case 'header':
        return (
          <View style={[styles.header, componentStyles]}>
            <Text style={styles.name}>{data.personalInfo.name}</Text>
            <Text style={styles.contact}>{data.personalInfo.email}</Text>
            <Text style={styles.contact}>{data.personalInfo.phone}</Text>
            <Text style={styles.contact}>{data.personalInfo.location}</Text>
            {data.personalInfo.linkedin && (
              <Text style={styles.contact}>LinkedIn: {data.personalInfo.linkedin}</Text>
            )}
            {data.personalInfo.website && (
              <Text style={styles.contact}>Website: {data.personalInfo.website}</Text>
            )}
          </View>
        );

      case 'section':
        const sectionData = data[props.dataKey as keyof ResumeData];
        if (!sectionData || (Array.isArray(sectionData) && sectionData.length === 0)) {
          return <></>;
        }

        return (
          <View style={[styles.section, componentStyles]}>
            <Text style={styles.sectionTitle}>{props.title}</Text>
            {children?.map((child, index) => (
              <React.Fragment key={child.id || index}>
                {this.renderComponent(child, data, styles)}
              </React.Fragment>
            ))}
          </View>
        );

      case 'experience':
        return (
          <>
            {data.experience.map((exp, index) => (
              <View key={exp.id || index} style={[styles.experienceItem, componentStyles]}>
                <View style={styles.experienceHeader}>
                  <View>
                    <Text style={styles.jobTitle}>{exp.title}</Text>
                    <Text style={styles.company}>{exp.company}</Text>
                    <Text style={styles.location}>{exp.location}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.duration}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </Text>
                  </View>
                </View>
                <Text style={styles.description}>{exp.description}</Text>
                {exp.achievements && exp.achievements.length > 0 && (
                  <View style={styles.achievements}>
                    {exp.achievements.map((achievement, achIndex) => (
                      <Text key={achIndex} style={styles.achievementItem}>
                        • {achievement}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        );

      case 'education':
        return (
          <>
            {data.education.map((edu, index) => (
              <View key={edu.id || index} style={[styles.educationItem, componentStyles]}>
                <Text style={styles.degree}>{edu.degree}</Text>
                <Text style={styles.institution}>{edu.institution}</Text>
                <Text style={styles.location}>{edu.location}</Text>
                <Text style={styles.duration}>
                  {edu.graduationDate}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                  {edu.honors && ` • ${edu.honors}`}
                </Text>
              </View>
            ))}
          </>
        );

      case 'skills':
        return (
          <View style={[styles.skillsContainer, componentStyles]}>
            {data.skills.map((skillCategory, index) => (
              <View key={skillCategory.id || index} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>{skillCategory.category}</Text>
                <Text style={styles.skillItems}>
                  {skillCategory.items.join(' • ')}
                </Text>
              </View>
            ))}
          </View>
        );

      case 'spacer':
        return <View style={[styles.spacer, componentStyles]} />;

      default:
        return <></>;
    }
  }

  static createResumeDocument(
    template: TemplateComponent[], 
    data: ResumeData, 
    globalStyles: Record<string, any> = {}
  ) {
    const styles = this.createStyles(globalStyles);

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {template.map((component, index) => (
            <React.Fragment key={component.id || index}>
              {this.renderComponent(component, data, styles)}
            </React.Fragment>
          ))}
        </Page>
      </Document>
    );
  }

  static getDefaultTemplate(): TemplateComponent[] {
    return [
      {
        id: 'header',
        type: 'header',
        props: {},
      },
      {
        id: 'summary',
        type: 'section',
        props: {
          title: 'Professional Summary',
          dataKey: 'summary',
        },
        children: [
          {
            id: 'summary-text',
            type: 'text',
            props: {
              content: '{{summary}}',
              styleKey: 'description',
            },
          },
        ],
      },
      {
        id: 'experience',
        type: 'section',
        props: {
          title: 'Professional Experience',
          dataKey: 'experience',
        },
        children: [
          {
            id: 'experience-list',
            type: 'experience',
            props: {},
          },
        ],
      },
      {
        id: 'education',
        type: 'section',
        props: {
          title: 'Education',
          dataKey: 'education',
        },
        children: [
          {
            id: 'education-list',
            type: 'education',
            props: {},
          },
        ],
      },
      {
        id: 'skills',
        type: 'section',
        props: {
          title: 'Skills',
          dataKey: 'skills',
        },
        children: [
          {
            id: 'skills-list',
            type: 'skills',
            props: {},
          },
        ],
      },
    ];
  }
}

