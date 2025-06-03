import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from "./button";
import { SignInButton, SignedIn, SignedOut, UserButton, SignIn } from "@clerk/clerk-react";
import { BriefcaseBusiness, PenBox, Heart } from "lucide-react";
import { useState } from 'react';
import { useUser } from "@clerk/clerk-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  
  const[search, setSearch] = useSearchParams();
  const {user} = useUser();
  useEffect(() => {
    if(search.get('sign-in')){
      setShowSignIn(true);
    }
  },[search])

  const handleOverlayClick = (e) => {
    if(e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    } 
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center ">
        <Link>
          <img src="/logo.png" alt="logo" className="h-20" />
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {/* add a condition */}
            { user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button variant="destructive" className="rounded-full">
                  <PenBox size={20} className="mr-2" />
                  Post a Job
                </Button>
              </Link>
            )}

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={16} />}
                  href="/my-jobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={16} />}
                  href="/saved-job"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity/50 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
}

export default Header
