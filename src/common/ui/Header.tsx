import React, { useContext, useState } from 'react';
import FocusLock from 'react-focus-lock';
import { Link, NavLink } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import styled, { css } from 'styled-components/macro';
import { AnimatePresence, motion } from 'framer-motion';

import { ReactComponent as LogoSvg } from '../../resources/images/logo.svg';
import { ReactComponent as BarsIcon } from '../../resources/icons/bars.svg';
import { ReactComponent as TimesIcon } from '../../resources/icons/times.svg';
import { CharacterColors } from '../Constants';
import AccountContext from '../contexts/AccountContext';

const SkipNavigation = styled(HashLink)`
  position: fixed;
  top: 70px;
  left: -10rem;
  z-index: 1002;
  padding: 1rem;
  background-color: white;
  box-shadow: 0 0 2px rgb(0 0 0 / 20%), 0 0 4px rgb(0 0 0 / 20%), 0 0 16px rgb(0 0 0 / 20%);
  transition: left 0.2s ease;
  &:focus {
    left: 10px;
  }
`;

const Logo = styled(LogoSvg)`
  display: block;
  margin-left: 20px;
  height: 60px;
`;

const iconStyle = css`
  height: 1.25rem;
  fill: #25313e;
`;

const HamburgerIcon = styled(BarsIcon)`
  ${iconStyle};
`;

const CloseIcon = styled(TimesIcon)`
  ${iconStyle};
`;

const StyledLink = styled(NavLink)`
  height: 60px;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #25313e;
  font-size: 1rem;
  cursor: pointer;
  &:hover,
  &:active,
  &.active {
    color: ${CharacterColors.Red};
  }
`;

interface NavItemProps {
  to: string;
  exact?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

function NavItem({ to, exact, onClick, children }: NavItemProps) {
  return (
    <li>
      <StyledLink to={to} onClick={onClick} exact={exact}>
        {children}
      </StyledLink>
    </li>
  );
}

const NavList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  font-family: 'Short Stack', cursive;
  @media screen and (min-width: 900px) {
    flex-direction: row;
  }
`;

const DesktopNav = styled.div`
  display: none;
  @media screen and (min-width: 900px) {
    display: flex;
  }
`;

interface NavigationProps {
  onClickItem?: () => void;
  accountText: string;
}

function Nav({ onClickItem, accountText }: NavigationProps) {
  return (
    <nav>
      <NavList>
        <NavItem onClick={onClickItem} to="/" exact>
          Home
        </NavItem>
        <NavItem onClick={onClickItem} to="/about">
          About
        </NavItem>
        <NavItem onClick={onClickItem} to="/readme">
          Getting started
        </NavItem>
        <NavItem onClick={onClickItem} to="/tournament">
          Tournament
        </NavItem>
        <NavItem onClick={onClickItem} to="/search">
          Old games
        </NavItem>
        <NavItem onClick={onClickItem} to="/account">
          {accountText}
        </NavItem>
      </NavList>
    </nav>
  );
}

const HamburgerMenuButton = styled.button`
  height: 60px;
  width: 60px;
  border: none;
  cursor: pointer;
  background-color: white;
  &:hover {
    background-color: #eee;
  }
  @media screen and (min-width: 900px) {
    display: none;
  }
`;

const HamburgerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  @media screen and (min-width: 900px) {
    display: none;
  }
`;

const HamburgerMenu = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 200px;
  background-color: white;
  box-shadow: 0 0 2px rgb(0 0 0 / 20%), 0 0 4px rgb(0 0 0 / 20%), 0 0 16px rgb(0 0 0 / 20%);
  z-index: 1002;
  transition: right 0.5s ease;
  @media screen and (min-width: 900px) {
    display: none;
  }
`;

const JustifyRight = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

interface HamburgerNavProps {
  open: boolean;
  children: React.ReactNode;
}

const HamburgerNav = ({ open, children }: HamburgerNavProps) => <AnimatePresence>{open && children}</AnimatePresence>;

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;
  background-color: white;
  box-shadow: 0 0 2px rgb(0 0 0 / 20%), 0 0 4px rgb(0 0 0 / 20%), 0 0 16px rgb(0 0 0 / 20%);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const scrollWithOffset = (element: HTMLElement) => {
  const yCoordinate = element.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -60;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
};

export default function Header() {
  const [open, setOpen] = useState(false);
  const { loggedIn, username } = useContext(AccountContext);
  const accountText = loggedIn ? username : 'Log in';

  const toggleMenu = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  const closeOnEscape = (event: React.KeyboardEvent) => {
    if (event.keyCode === 27) {
      closeMenu();
    }
  };

  return (
    <>
      <SkipNavigation to="#content" scroll={element => scrollWithOffset(element)}>
        Skip to content
      </SkipNavigation>
      <StyledHeader>
        <Link to="/">
          <Logo role="img" aria-label="Paintbot" />
        </Link>
        <DesktopNav>
          <Nav accountText={accountText} />
        </DesktopNav>
        <HamburgerMenuButton onClick={toggleMenu}>
          <HamburgerIcon role="img" aria-label="Open menu" />
        </HamburgerMenuButton>
      </StyledHeader>
      <HamburgerNav open={open}>
        <HamburgerOverlay
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMenu}
        />
        <HamburgerMenu
          key="menu"
          initial={{ x: 210 }}
          animate={{ x: 0 }}
          exit={{ x: 210 }}
          transition={{ ease: 'easeOut', duration: 0.3 }}
          onKeyUp={closeOnEscape}
        >
          <FocusLock returnFocus>
            <JustifyRight>
              <HamburgerMenuButton onClick={closeMenu}>
                <CloseIcon role="img" aria-label="Close menu" />
              </HamburgerMenuButton>
            </JustifyRight>
            <Nav onClickItem={closeMenu} accountText={accountText} />
          </FocusLock>
        </HamburgerMenu>
      </HamburgerNav>
    </>
  );
}
