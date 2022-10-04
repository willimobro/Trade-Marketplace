//
//  MapView.swift
//  Trade Marketplace
//
//  Created by William larsen on 25/09/22.
//

import MapKit
import SwiftUI

struct MapView: View {
     
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(latitude: 37.334_900,
                                       longitude: -122.009_020),
        latitudinalMeters: 750,
        longitudinalMeters: 750
        
    )
    
    var body: some View {
        Rectangle()
            .frame(width: 351, height: 150, alignment: .center)
            .shadow(color: .gray, radius: 4, x: 0, y: 0)
            .overlay(Map(coordinateRegion: $region))
            
    }
}
struct MapView_Previews: PreviewProvider {
    static var previews: some View {
        MapView()
    }
}
