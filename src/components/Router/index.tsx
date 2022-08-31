import React, { lazy, memo, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutScreen from '../../screens/AboutScreen';
import AccountScreen from '../../screens/AccountScreen';
import ReadMeScreen from '../../screens/ReadMeScreen';
import TournamentScreen from '../../screens/TournamentScreen';
import WelcomeScreen from '../../screens/WelcomeScreen';
import Container from '../Container';
import Footer from '../Footer';
import Navbar from '../Navbar';
import Authenticated from './Authenticated';

const LazyGameScreen = lazy(() => import('../../screens/GameScreen'));
const LazySearchScreen = lazy(() => import('../../screens/SearchScreen'));

function Router() {
  return (
    <Suspense fallback={null}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Container />}>
            <Route index element={<WelcomeScreen />} />
            <Route path="/account" element={<AccountScreen />} />
            <Route path="/about" element={<AboutScreen />} />
            <Route path="/readme" element={<ReadMeScreen />} />
            <Route path={'/tournament'} element={<Authenticated />}>
              <Route index element={<TournamentScreen />} />
              <Route path="/tournament/started" element={<TournamentScreen />} />
            </Route>
            <Route path="/game/:id?" element={<LazyGameScreen />} />
            <Route path="/search" element={<LazySearchScreen />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </Suspense>
  );
}

export default memo(Router);
