import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  async function logout() {
    window.open("https://financeme-rwlo.onrender.com/auth/logout", "_self");
  }

  return (
    <div>
      <span>
        <Link to="/">Logo</Link>
      </span>
      {!user ? (
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      ) : (
        <ul>
          <li onClick={logout}>Logout</li>
        </ul>
      )}
    </div>
  );
};

export default Navbar;
