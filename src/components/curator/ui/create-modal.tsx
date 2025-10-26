import React, { Dispatch, SetStateAction } from "react";
import { FiX } from "react-icons/fi";

interface ICreateModal {
  setShowCreateModal: (show: boolean) => void;
  setShowSchoolModal: Dispatch<SetStateAction<boolean>>;
}

const CreateModal = ({
  setShowCreateModal,
  setShowSchoolModal,
}: ICreateModal) => {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-xl lg:text-2xl font-bold text-[#955aa4]">
            Creative Studios
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setShowCreateModal(false)}
          >
            <FiX className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          <button
            onClick={() => setShowSchoolModal(true)}
            className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group"
          >
            <div className="text-2xl lg:text-3xl mb-2">🏫</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              New Schools
            </h3>
          </button>
          <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
            <div className="text-2xl lg:text-3xl mb-2">👥</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              Our Team
            </h3>
          </button>
          <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
            <div className="text-2xl lg:text-3xl mb-2">🤝</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              New Partners
            </h3>
          </button>
          <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
            <div className="text-2xl lg:text-3xl mb-2">📻</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              Radio
            </h3>
          </button>
          <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
            <div className="text-2xl lg:text-3xl mb-2">🏥</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              Health Lineup
            </h3>
          </button>
          <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
            <div className="text-2xl lg:text-3xl mb-2">📢</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              Reach
            </h3>
          </button>
          <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
            <div className="text-2xl lg:text-3xl mb-2">🎨</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              Banner
            </h3>
          </button>
          <button className="p-3 lg:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center group">
            <div className="text-2xl lg:text-3xl mb-2">🎉</div>
            <h3 className="font-medium text-gray-800 text-sm lg:text-base">
              Events
            </h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
