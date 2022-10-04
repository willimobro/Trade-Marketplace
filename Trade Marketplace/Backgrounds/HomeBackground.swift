//
//  HomeBackground.swift
//  Trade Marketplace
//
//  Created by William larsen on 16/09/22.
//

import SwiftUI

struct HomeBackground: View {
    var body: some View {
        VStack{
            Rectangle()
                .foregroundColor(Color("Homebackgroundgreen"))
                .ignoresSafeArea()
                .overlay(
                    Rectangle()
                        .frame(maxWidth: .infinity, maxHeight: 700)
                        .foregroundColor(.white)
                        .offset(y: 200)
                ).frame(alignment: .bottom)

        }
    }
}

struct HomeBackground_Previews: PreviewProvider {
    static var previews: some View {
        HomeBackground()
    }
}
