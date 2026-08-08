const testCases = [
  { userToken: null, segments: [] }, // fresh install at root
  { userToken: null, segments: ['pages', 'auth', 'welcome'] }, // at welcome
  { userToken: 'token', segments: [] }, // logged in at root
  { userToken: 'token', segments: ['(tabs)'] }, // logged in at tabs
  { userToken: 'token', segments: ['pages', 'auth', 'welcome'] }, // logged in at welcome
];

testCases.forEach(({ userToken, segments }) => {
  const inAuthGroup = segments?.[0] === 'pages' && segments?.[1] === 'auth';
  const isAtRoot = !segments || segments.length === 0;

  let redirect = null;
  if (userToken && (inAuthGroup || isAtRoot)) {
    redirect = '/(tabs)';
  } else if (!userToken && (!inAuthGroup || isAtRoot)) {
    redirect = '/pages/auth/welcome';
  }

  console.log(`userToken: ${!!userToken}, segments: [${segments.join(', ')}] -> Redirect: ${redirect}`);
});
