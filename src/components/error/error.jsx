import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <div className="text-red-500 text-5xl mb-4 flex justify-center">
          <FaExclamationTriangle />
        </div>
        <h1 className="text-3xl font-semibold mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or was moved. Please check the URL or go back to the homepage.
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}


export default ErrorPage;