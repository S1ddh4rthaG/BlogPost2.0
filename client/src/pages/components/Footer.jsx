export default function Footer() {
  return (
    <div className="d-flex flex-column w-100 mt-3 text-center position-absolute end-0 bg-white justify-contents-center">
      <div className="m-2">
        <p className="m-1">
          Made with <i className="bi bi-heart-fill text-danger"></i> using MEAN
          Stack aided by PassportJS, EditorJS.
        </p>
        <p className="m-0">
          Made by: <span className="fw-bold">Siddhartha G</span>
        </p>
        <div className="social">
          <a href="https://github.com/S1ddh4rthaG" className="p-1 fs-5 me-2">
            <i class="bi bi-github text-dark"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
