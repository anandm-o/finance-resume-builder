import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Resume } from '../types/resume';

const RESUMES_COLLECTION = 'resumes';

// Create a new resume
export const createResume = async (resumeData: Omit<Resume, 'id'>, userId: string) => {
  try {
    const docRef = await addDoc(collection(db, RESUMES_COLLECTION), {
      ...resumeData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

// Get all resumes for a user
export const getUserResumes = async (userId: string): Promise<Resume[]> => {
  try {
    const q = query(
      collection(db, RESUMES_COLLECTION),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const resumes: Resume[] = [];
    
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      resumes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Resume);
    });
    
    return resumes;
  } catch (error) {
    console.error('Error getting user resumes:', error);
    throw error;
  }
};

// Get a specific resume by ID
export const getResume = async (resumeId: string): Promise<Resume | null> => {
  try {
    const docRef = doc(db, RESUMES_COLLECTION, resumeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Resume;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting resume:', error);
    throw error;
  }
};

// Update an existing resume
export const updateResume = async (resumeId: string, updates: Partial<Resume>) => {
  try {
    const docRef = doc(db, RESUMES_COLLECTION, resumeId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
};

// Delete a resume
export const deleteResume = async (resumeId: string) => {
  try {
    const docRef = doc(db, RESUMES_COLLECTION, resumeId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting resume:', error);
    throw error;
  }
};

// Duplicate a resume
export const duplicateResume = async (resumeId: string, userId: string): Promise<string> => {
  try {
    const originalResume = await getResume(resumeId);
    if (!originalResume) {
      throw new Error('Resume not found');
    }
    
    // Remove the ID and update metadata
    const { id, ...resumeData } = originalResume;
    const newResumeData = {
      ...resumeData,
      header: {
        ...resumeData.header,
        name: `${resumeData.header.name} (Copy)`,
      },
      meta: {
        ...resumeData.meta,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };
    
    return await createResume(newResumeData, userId);
  } catch (error) {
    console.error('Error duplicating resume:', error);
    throw error;
  }
};

// Search resumes by role target
export const searchResumesByRole = async (userId: string, roleTarget: string): Promise<Resume[]> => {
  try {
    const q = query(
      collection(db, RESUMES_COLLECTION),
      where('userId', '==', userId),
      where('meta.roleTarget', '==', roleTarget),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const resumes: Resume[] = [];
    
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      resumes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Resume);
    });
    
    return resumes;
  } catch (error) {
    console.error('Error searching resumes by role:', error);
    throw error;
  }
};
