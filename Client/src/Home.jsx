import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleGetStarted = () => {
    if (auth?.token) {
      navigate(auth.role === "student" ? "/student" : "/recruiter");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition"
          >
            EduLift
          </button>
          <div className="flex items-center gap-4">
            {auth?.token ? (
              <button
                onClick={() => navigate(auth.role === "student" ? "/student" : "/recruiter")}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-indigo-600 font-semibold hover:text-indigo-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Empowering Students,<br />
          <span className="text-indigo-600">One Scholarship at a Time</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Unlock education opportunities — get support or contribute to help students succeed.
        </p>
        <button
          onClick={handleGetStarted}
          className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg transform hover:scale-105"
        >
          Get Started
        </button>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Making Education Accessible</h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            Join thousands of students who have transformed their educational journey with EduLift
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">💎 $2.5M+</div>
              <p className="text-gray-700 font-semibold">Scholarship Funds Awarded</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">🎓 15,000+</div>
              <p className="text-gray-700 font-semibold">Students Supported</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">🤝 1,200+</div>
              <p className="text-gray-700 font-semibold">Partner Organizations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How EduLift Transforms Your Future
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            Discover the tools and resources that have helped thousands of students achieve their educational dreams
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Financial Aid</h3>
              <p className="text-gray-600">
                Access resources to help fund your education through grants, scholarships, and low-interest loans.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skill-Based Scholarships</h3>
              <p className="text-gray-600">
                Discover opportunities based on your unique talents, not just academic achievements.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Micro-Internships</h3>
              <p className="text-gray-600">
                Gain valuable experience through short-term projects with industry-leading companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-16 rounded-2xl mx-4 sm:mx-6 lg:mx-8 my-20">
        <div className="max-w-4xl mx-auto px-8 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your<br />
            Educational Journey?
          </h2>
          <p className="text-lg text-indigo-100 mb-8">
            Join thousands of students who've unlocked their potential and found amazing educational opportunities through EduLift.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl text-lg transform hover:scale-105"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">What You'll Get:</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Personalized scholarship recommendations",
              "Application deadline reminders",
              "Direct connections with internship providers",
              "Community support from peers and mentors",
              "24/7 application assistance",
              "Career guidance and mentorship",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-600 text-white">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Success Stories from Our Community
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">
            Real students, real results. See how EduLift has transformed educational journeys
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-700 mb-6 italic">
                "EduLift helped me discover a scholarship I didn't know I qualified for. I'm now pursuing my dream degree!"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                  AJ
                </div>
                <div>
                  <p className="font-bold text-gray-900">Alex Johnson</p>
                  <p className="text-sm text-gray-600">Computer Science Major</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-700 mb-6 italic">
                "The micro-internship I found through EduLift gave me real-world experience that helped me land my first job."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  MP
                </div>
                <div>
                  <p className="font-bold text-gray-900">Maya Patel</p>
                  <p className="text-sm text-gray-600">Business Administration</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <p className="text-gray-700 mb-6 italic">
                "As a first-generation college student, I was lost until I found EduLift. The resources here made higher education possible for me."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  CR
                </div>
                <div>
                  <p className="font-bold text-gray-900">Carlos Rodriguez</p>
                  <p className="text-sm text-gray-600">Engineering Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Trusted By Leading Institutions
          </h2>
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg transform hover:scale-105"
          >
            Join Our Community Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 EduLift. Empowering students through education and opportunity.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
