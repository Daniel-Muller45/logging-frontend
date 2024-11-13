// components/Footer.js
import React from 'react';

const Footer = () => {
    return (
        <footer className="text-white py-6">
            <div className="container mx-auto flex items-center justify-center">
                    <div className="mr-8">
                        <h3 className="font-semibold">Quick Links</h3>
                        <ul>

                            <li><a href="/privacy.html" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold">Contact Us</h3>
                        <ul>
                            <li><a href="mailto:oraai.fitness@gmail.com" className="hover:underline">oraai.fitness@gmail.com</a></li>
                        </ul>
                    </div>
            </div>

        </footer>
    );
};

export default Footer;