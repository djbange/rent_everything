import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&display=swap');
  @import url("https://fonts.googleapis.com/css?family=Fira+Sans:400,500,600,700,800");
  @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css');
  @import url('https://unpkg.com/flickity@2/dist/flickity.min.css');
  @import url('https://api.mapbox.com/mapbox-gl-js/v2.8.1/mapbox-gl.css');

  html,
  body {
    height: 100%;
    width: 100%;
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Poppins', sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
  }

  p,
  label {
    line-height: 1.5em;
  }

  .navBarDrop {
    padding-top: 60px;
  }

  .navBarDropLoginSignup {
    padding-top: 110px;
  }

  .formContainer {
    width: 450px;
    margin: auto;
    background: #e3dcd8;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
    padding: 40px 55px 45px 55px;
    border-radius: 15px;
    transition: all 0.3s;
  }
  
  .formContainer .form-control:focus {
    border-color: #000000;
    box-shadow: none;
  }
  
  .formContainer h3 {
    text-align: center;
    margin: 0;
    line-height: 1;
    padding-bottom: 20px;
  }
  
  .forgot-password,
  .forgot-password Link {
    text-align: right;
    font-size: 13px;
    padding-top: 10px;
    color: #7f7d7d;
    margin: 0;
  }
  
  .forgot-password Link {
    color: #0f0e0f;
  }
`;

export default GlobalStyle;
