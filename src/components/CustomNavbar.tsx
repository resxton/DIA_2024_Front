import { FC } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import logo from '../assets/logo.svg';

interface CustomNavbarProps {
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}

const CustomNavbar: FC<CustomNavbarProps> = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => navigate('/');
  const handleLogoutClick = () => {
    onLogout();
  };

  return (
    <Navbar className="bg-body-tertiary" expand="lg">
      <Navbar.Brand onClick={handleLogoClick} style={{ cursor: 'pointer' }} className="m-3">
        <img
          src={logo}
          alt="Nimbus Logo"
          width={30}
          height={30}
          className="d-inline-block align-top"
        />{' '}
        Nimbus
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to={ROUTES.ELEMENTS}>{ROUTE_LABELS.ELEMENTS}</Nav.Link>
          {!isAuthenticated ? (
            <>
              <Nav.Link as={Link} to={ROUTES.LOGIN}>Войти</Nav.Link>
              <Nav.Link as={Link} to={ROUTES.REGISTER}>Зарегистрироваться</Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to={ROUTES.USER_DASHBOARD}>{user?.username}</Nav.Link>
              <Nav.Link onClick={handleLogoutClick}>Выйти</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
