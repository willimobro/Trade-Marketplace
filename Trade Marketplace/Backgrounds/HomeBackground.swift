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
                .ignoresSafeArea()
                .overlay(
                    Rectangle()
                        .frame(height: 700 + (background - 409))
                        .foregroundColor(.white)
                        .offset(y: 200)
                        .overlay(
                            Text("\(background)")
                                .foregroundColor(.red)
                        )
                ).frame(alignment: .bottom)
        }
    }
}

//struct HomeBackground_Previews: PreviewProvider {
//    static var previews: some View {
//        HomeBackground()
//    }
//}
