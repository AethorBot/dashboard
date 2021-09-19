import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider, ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
	initialColorMode: 'dark',
	useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({ config });
function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Component {...pageProps} />
		</ChakraProvider>
	);
}
export default MyApp;
