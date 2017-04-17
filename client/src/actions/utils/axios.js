import axios from 'axios';

export default () => {
    const token = sessionStorage.getItem('jwtToken');
    const config = {
        headers: {
            Authorization: token
        }
    };
    return axios.create(config);
};
