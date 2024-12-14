import { FC } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import logo from '../assets/logo.svg';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store'; // Импортируем AppDispatch
import { logoutAsync } from '../redux/authSlice';

interface CustomNavbarProps {
  isAuthenticated: boolean;
  user: any;
}

const CustomNavbar: FC<CustomNavbarProps> = ({ isAuthenticated, user }) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch(); // Типизируем dispatch

  const handleLogoClick = () => navigate('/');

  const handleLogoutClick = () => {
    dispatch(logoutAsync()); // Теперь ошибки быть не должно
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
          {isAuthenticated ? (
            <Nav.Link as={Link} to={ROUTES.CONFIGURATIONS}>{ROUTE_LABELS.CONFIGURATIONS}</Nav.Link>
          ) : null}
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
