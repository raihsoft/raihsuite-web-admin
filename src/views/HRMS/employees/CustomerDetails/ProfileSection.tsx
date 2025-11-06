import { Customer } from '../CustomerList/types'

const ProfileSection = ({ data }: { data: Customer }) => {
    return (
        <div className="p-4 text-center">
            
            <h2 className="text-xl font-semibold mt-2">{data.name}</h2>
            <p className="text-gray-600">{data.designation}</p>
            <p className="text-gray-500">{data.organization}</p>
            


            <div className="flex justify-center gap-3 mt-4">
                {data.facebook_link && (
                    <a href={data.facebook_link} target="_blank" rel="noreferrer">
                        <i className="fab fa-facebook text-blue-600"></i>
                    </a>
                )}
                {data.instagram_link && (
                    <a href={data.instagram_link} target="_blank" rel="noreferrer">
                        <i className="fab fa-instagram text-pink-500"></i>
                    </a>
                )}
                {data.linkedin_link && (
                    <a href={data.linkedin_link} target="_blank" rel="noreferrer">
                        <i className="fab fa-linkedin text-blue-700"></i>
                    </a>
                )}
                {data.youtube_link && (
                    <a href={data.youtube_link} target="_blank" rel="noreferrer">
                        <i className="fab fa-youtube text-red-600"></i>
                    </a>
                )}
                {data.website_link && (
                    <a href={data.website_link} target="_blank" rel="noreferrer">
                        🌐
                    </a>
                )}
                {data.email_link && (
                    <a href={`mailto:${data.email_link}`}>
                        ✉️
                    </a>
                )}
            </div>
        </div>
    )
}

export default ProfileSection
