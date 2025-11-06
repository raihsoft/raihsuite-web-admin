import { Customer } from '../CustomerList/types'

const ProfileSection = ({ data }: { data: Customer }) => {
    return (
        <div className="p-4 text-center">
            
            <h2 className="text-xl font-semibold mt-2">{data.zone_name}</h2>
   
            


            <div className="flex justify-center gap-3 mt-4">
                {data.zone_name && (
                    <a href={data.zone_name} target="_blank" rel="noreferrer">
                        <i className="fab fa-facebook text-blue-600"></i>
                    </a>
                )}
              
            </div>
        </div>
    )
}

export default ProfileSection
