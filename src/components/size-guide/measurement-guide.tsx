export function MeasurementGuide() {
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-serif font-bold mb-4">How to Measure</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Bust</h3>
            <p className="text-sm text-muted-foreground">
              Measure around the fullest part of your bust, keeping the tape
              level and snug but not tight.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Waist</h3>
            <p className="text-sm text-muted-foreground">
              Measure around your natural waistline, which is the narrowest part
              of your torso.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Hips</h3>
            <p className="text-sm text-muted-foreground">
              Measure around the fullest part of your hips, keeping the tape
              parallel to the floor.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Shoulders</h3>
            <p className="text-sm text-muted-foreground">
              Measure from one shoulder point to the other across the back.
            </p>
          </div>
        </div>
        <div className="bg-muted rounded-lg p-6">
          <h3 className="font-semibold mb-3">Tips for Best Results</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-asa-gold font-bold">1.</span>
              Use a soft measuring tape, not a metal one.
            </li>
            <li className="flex gap-2">
              <span className="text-asa-gold font-bold">2.</span>
              Stand relaxed in your normal posture.
            </li>
            <li className="flex gap-2">
              <span className="text-asa-gold font-bold">3.</span>
              Wear lightweight clothing or measure directly on skin.
            </li>
            <li className="flex gap-2">
              <span className="text-asa-gold font-bold">4.</span>
              If between sizes, we recommend sizing up for a more comfortable
              fit.
            </li>
            <li className="flex gap-2">
              <span className="text-asa-gold font-bold">5.</span>
              Our Ankara pieces are designed with a slightly relaxed fit.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
