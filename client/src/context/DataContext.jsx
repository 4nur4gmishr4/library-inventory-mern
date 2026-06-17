import { createContext, useState, useCallback } from 'react';
import api from '../api/axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Caching the list in context so the UI doesn't violently jump around when switching tabs
  const [books, setBooks] = useState([]);
  const [isBooksLoading, setIsBooksLoading] = useState(true);
  const [booksFetched, setBooksFetched] = useState(false);

  const [members, setMembers] = useState([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);
  const [membersFetched, setMembersFetched] = useState(false);

  const fetchBooks = useCallback(async (background = false) => {
    // If we're background fetching, don't trigger the skeleton loaders
    if (!background) setIsBooksLoading(true);
    try {
      const res = await api.get('/books');
      setBooks(Array.isArray(res.data) ? res.data : []);
      setBooksFetched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooksLoading(false);
    }
  }, []);

  const fetchMembers = useCallback(async (background = false) => {
    if (!background) setIsMembersLoading(true);
    try {
      const res = await api.get('/members');
      setMembers(Array.isArray(res.data) ? res.data : []);
      setMembersFetched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsMembersLoading(false);
    }
  }, []);

  return (
    <DataContext.Provider value={{
      books, isBooksLoading, fetchBooks, booksFetched,
      members, isMembersLoading, fetchMembers, membersFetched
    }}>
      {children}
    </DataContext.Provider>
  );
};
