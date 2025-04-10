"use client"

class Helpers {
    static localhost: string = 'localhost:8000';
    static server: string = 'api.holyvibes.org';
    static basePath: string = `http://${this.server}`;
    static apiUrl: string = `${this.basePath}/api/`;
    static imageUrl: string = `${this.basePath}/storage/`;
    static serverImage = (name: string): string => {
        return `${this.basePath}/uploads/${name}`;
    };
    static authHeaders: { headers: { "Content-Type": string, "token": string } } = {
        headers: {
            "Content-Type": 'application/json',
            "token": `${localStorage.getItem("token")}`,
        },
    };
    static authFileHeaders: { headers: { "Content-Type": string, "token": string } } = {
        headers: {
            "Content-Type": 'multipart/form-data',
            "token": `${localStorage.getItem("token")}`,
        },
    };
}

export default Helpers;
