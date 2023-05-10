import request from "@/utils/request";

/**
 * 
 * @param {*} formData 
 * @param {*} params.type AVATAR | IMAGE
 * @param {*} params.scope PUBLIC | PRIVATE
 * @returns 
 */
export const uploadFile = (formData, params) => {
  return request({
    url: `/api/open/common/files?type=${params.type}&scope=${params.scope}`,
    method: "post",
		data: formData,
  });
}

export const getFile = (fileId) => {
  return request({
    url: `/api/open/common/files/${fileId}`,
    method: "get",
  });
}

export const previewFile = (fileId) => {
  return request({
    url: `/api/open/common/files/${fileId}/preview`,
    method: "get",
  });
}