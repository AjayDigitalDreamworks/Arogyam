import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

function LandingFooter() {
  return (
    <footer className="bg-card border-t border-border px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-bold text-primary">Arogyam</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Supporting college students' mental wellness journey.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link
                to="/dashboard"
                className="block text-muted-foreground hover:text-primary"
              >
                About Us
              </Link>
              <Link
                to="/resources"
                className="block text-muted-foreground hover:text-primary"
              >
                Resources
              </Link>
              <Link
                to="/community"
                className="block text-muted-foreground hover:text-primary"
              >
                Community
              </Link>
              <Link
                to="/appointments"
                className="block text-muted-foreground hover:text-primary"
              >
                Book Session
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <div className="space-y-2 text-sm">
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary"
              >
                Crisis Hotline
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary"
              >
                Emergency Contact
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary"
              >
                Help Center
              </a>
              <a
                href="#"
                className="block text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Remember</h4>
            <p className="text-sm text-muted-foreground">
              "You are stronger than you think, braver than you feel, and more
              loved than you know."
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>
            © 2025 Arogyam. All rights reserved. Your mental health matters.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;
