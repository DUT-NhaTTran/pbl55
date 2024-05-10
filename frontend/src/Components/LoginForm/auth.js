
// Lưu trữ thông tin đăng nhập
export const setAuthInfo = (username, role) => {
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
};

// Lấy thông tin đăng nhập
export const getAuthInfo = () => {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    return { username, role };
};

// Xóa thông tin đăng nhập
export const clearAuthInfo = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('role');
};
