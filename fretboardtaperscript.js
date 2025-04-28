function calculate() {
    const A = parseFloat(document.getElementById('a').value);
    const B = parseFloat(document.getElementById('b').value);
    const d = parseFloat(document.getElementById('d').value);
    const S = parseFloat(document.getElementById('s').value);
    const L = parseFloat(document.getElementById('l').value);
    const unit = document.getElementById('unit').value;

    if (isNaN(A) || isNaN(B) || isNaN(d) || isNaN(S) || isNaN(L)) {
        document.getElementById('result').innerText = 'Please fill all fields correctly!';
        return;
    }

    const widthAtEnd = A + d + d + ((B - A) * (L / S));
    let unitLabel = unit === 'metric' ? 'mm' : 'in';

    document.getElementById('result').innerText = `Width at End of Fretboard: ${widthAtEnd.toFixed(2)} ${unitLabel}`;
}
