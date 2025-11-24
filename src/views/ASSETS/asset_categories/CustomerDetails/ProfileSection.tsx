// import { Customer } from "../AssetList/types"

import { Customer } from "../AssetCategoriesList/types"

const ProfileSection = ({ data }: { data: Customer }) => {
    return (
        <div className="min-h-screen bg-gray-50 p-8 flex justify-center">

            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200">

                {/* Header Section */}
                <div className="border-b px-8 py-6 bg-gray-100 rounded-t-xl">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {data.name}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {/* {data.title} */}
                    </p>
                </div>

                {/* Content Section */}
                <div className="px-8 py-6 space-y-6">

                    {/* Row */}
                    <div className="flex justify-between pb-4 border-b">
                        <span className="text-gray-500 text-sm">Category</span>
                        <span className="text-gray-800 font-medium">
                            {/* {data.asset_category} */}
                        </span>
                    </div>

                    {/* Row */}
                    <div className="flex justify-between pb-4 border-b">
                        <span className="text-gray-500 text-sm">Asset Type</span>
                        <span className="text-gray-800 font-medium">
                            {/* {data.asset_type_ref} */}
                        </span>
                    </div>

                    {/* Row */}
                    <div className="flex justify-between pb-4 border-b">
                        <span className="text-gray-500 text-sm">File Extension</span>
                        <span className="text-gray-800 font-medium break-all">
                            {/* {data.file_extension} */}
                        </span>
                    </div>

                </div>

                {/* Footer */}
                

            </div>
        </div>
    )
}

export default ProfileSection
