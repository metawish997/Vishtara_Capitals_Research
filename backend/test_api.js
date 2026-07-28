const http = require('http');

http.get('http://localhost:5000/api/services/plans', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const plan = json.data.find(p => p.name === 'Basic Index Option');
      console.log("Plan Name:", plan.name);
      console.log("Durations:");
      plan.durations.forEach(d => {
        console.log(" - Duration ID:", d._id, d.duration_type);
        console.log("   Features:", d.features.map(f => ({ id: f._id, text: f.text, svg_icon: f.svg_icon, createdAt: f.createdAt })));
      });
    } catch (e) {
      console.error(e);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
