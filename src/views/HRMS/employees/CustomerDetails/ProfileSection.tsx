import { Customer } from '../CustomerList/types'
import Card from '@/components/ui/Card'
import { FaInstagram } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { AiFillYoutube } from "react-icons/ai";
import { IoEarthOutline } from "react-icons/io5";
const ProfileSection = ({ data }: { data: Customer }) => {
    return (
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
            <div className="p-6">
                {/* Header with Avatar Placeholder */}
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">{data.name}</h1>
                    {data.designation && (
                        <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold mt-1">{data.designation}</p>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                {/* Info Grid */}
                <div className="space-y-4 mb-6">
                    {data.organization && (
                        <div className="flex items-start">
                            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[120px]">Organization:</span>
                            <span className="text-gray-900 dark:text-gray-100">{data.organization}</span>
                        </div>
                    )}
                    {data.email_link && (
                        <div className="flex items-start">
                            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[120px]">Email:</span>
                            <a href={`mailto:${data.email_link}`} className="text-blue-600 dark:text-blue-400 hover:underline break-all">
                                {data.email_link}
                            </a>
                        </div>
                    )}
                    {data.phone && (
                        <div className="flex items-start">
                            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[120px]">Phone:</span>
                            <a href={`tel:${data.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                                {data.phone}
                            </a>
                        </div>
                    )}
                    {data.personalInfo?.location && (
                        <div className="flex items-start">
                            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-[120px]">Location:</span>
                            <span className="text-gray-900 dark:text-gray-100">{data.personalInfo.location}</span>
                        </div>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                {/* Social Links */}
                {(data.facebook_link || data.instagram_link || data.linkedin_link || data.youtube_link || data.website_link) && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">Connect</h3>
                        <div className="flex justify-center gap-4 flex-wrap">
                            {data.facebook_link && (
                                <a 
                                    href={data.facebook_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-colors"
                                    title="Facebook"
                                >
                                    <FaFacebookSquare className="text-2xl" />
                                </a>
                            )}
                            {data.instagram_link && (
                                <a 
                                    href={data.instagram_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-10 h-10 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center text-pink-600 dark:text-pink-300 hover:bg-pink-600 dark:hover:bg-pink-600 hover:text-white transition-colors"
                                    title="Instagram"
                                >
                                    <FaInstagram className="text-2xl" />
                                </a>
                            )}
                            {data.linkedin_link && (
                                <a 
                                    href={data.linkedin_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-300 hover:bg-blue-700 dark:hover:bg-blue-700 hover:text-white transition-colors"
                                    title="LinkedIn"
                                >
                                    <FaLinkedin className="text-2xl" />
                                </a>
                            )}
                            {data.youtube_link && (
                                <a 
                                    href={data.youtube_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-red-600 dark:text-red-300 hover:bg-red-600 dark:hover:bg-red-600 hover:text-white transition-colors"
                                    title="YouTube"
                                >
                                   <AiFillYoutube className="text-2xl" />
                                </a>
                            )}
                            {data.website_link && (
                                <a 
                                    href={data.website_link} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-600 dark:hover:bg-gray-600 hover:text-white transition-colors"
                                    title="Website"
                                >
                                    <IoEarthOutline className="text-2xl" />
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}

export default ProfileSection
