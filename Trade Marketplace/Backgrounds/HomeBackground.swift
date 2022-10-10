//
//  HomeBackground.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct HomeBackground: View {
    @Binding var background: CGFloat
    var body: some View {
        VStack{
            Rectangle()
                .foregroundColor(Color("Homebackgroundgreen"))
                .frame(height: background + 110)
            Rectangle()
                .foregroundColor(.white)
        }.ignoresSafeArea()
    }
}

//struct HomeBackground_Previews: PreviewProvider {
//    static var previews: some View {
//        HomeBackground()
//    }
//}
