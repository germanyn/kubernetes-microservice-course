import type { AxiosInstance } from "axios"
import Next from "next";

declare global {
    namespace Next {
        interface NextComponentType {
            getInitialProps?(context: C, algo: number): IP | Promise<IP>;
        }
    }
}

export default {}
