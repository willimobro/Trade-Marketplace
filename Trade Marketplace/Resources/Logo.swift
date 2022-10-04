//
//  Logo.swift
//  Trade Marketplace
//
//  Created by William larsen on 13/09/22.
//

import SwiftUI

struct LogoView: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        let width = rect.size.width
        let height = rect.size.height
        path.move(to: CGPoint(x: 0.94853*width, y: 0.43128*height))
        path.addLine(to: CGPoint(x: 0.7764*width, y: 0.43128*height))
        path.addLine(to: CGPoint(x: 0.70292*width, y: 0.54277*height))
        path.addCurve(to: CGPoint(x: 0.47567*width, y: 0.63574*height), control1: CGPoint(x: 0.6655*width, y: 0.59913*height), control2: CGPoint(x: 0.57637*width, y: 0.63574*height))
        path.addLine(to: CGPoint(x: 0.29878*width, y: 0.63574*height))
        path.addLine(to: CGPoint(x: 0.22053*width, y: 0.75422*height))
        path.addLine(to: CGPoint(x: 0.0865*width, y: 0.95663*height))
        path.addCurve(to: CGPoint(x: 0.15658*width, y: 0.98419*height), control1: CGPoint(x: 0.06881*width, y: 0.98296*height), control2: CGPoint(x: 0.12392*width, y: 1.00476*height))
        path.addLine(to: CGPoint(x: 0.52806*width, y: 0.75381*height))
        path.addLine(to: CGPoint(x: 0.97915*width, y: 0.47448*height))
        path.addCurve(to: CGPoint(x: 0.94853*width, y: 0.43046*height), control1: CGPoint(x: 1.00568*width, y: 0.45802*height), control2: CGPoint(x: 0.98663*width, y: 0.43046*height))
        path.addLine(to: CGPoint(x: 0.94853*width, y: 0.43128*height))
        path.closeSubpath()
        path.move(to: CGPoint(x: 0.24979*width, y: 0.56169*height))
        path.addLine(to: CGPoint(x: 0.04296*width, y: 0.56169*height))
        path.addCurve(to: CGPoint(x: 0.01234*width, y: 0.51767*height), control1: CGPoint(x: 0.00485*width, y: 0.56169*height), control2: CGPoint(x: -0.0142*width, y: 0.53413*height))
        path.addLine(to: CGPoint(x: 0.46343*width, y: 0.23834*height))
        path.addLine(to: CGPoint(x: 0.83491*width, y: 0.00797*height))
        path.addCurve(to: CGPoint(x: 0.90499*width, y: 0.03553*height), control1: CGPoint(x: 0.86757*width, y: -0.01219*height), control2: CGPoint(x: 0.92268*width, y: 0.0092*height))
        path.addLine(to: CGPoint(x: 0.77095*width, y: 0.23793*height))
        path.addLine(to: CGPoint(x: 0.58793*width, y: 0.5148*height))
        path.addCurve(to: CGPoint(x: 0.47431*width, y: 0.56128*height), control1: CGPoint(x: 0.56957*width, y: 0.54277*height), control2: CGPoint(x: 0.52466*width, y: 0.56128*height))
        path.addLine(to: CGPoint(x: 0.24911*width, y: 0.56128*height))
        path.addLine(to: CGPoint(x: 0.24979*width, y: 0.56169*height))
        path.closeSubpath()
        return path
    }
}

struct Logovie_Preview: PreviewProvider {
    static var previews: some View {
        LogoView()
    }
}
