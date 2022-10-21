//
//  Uploadajobacc.swift
//  Trade Marketplace
//
//  Created by William larsen on 24/09/22.
//

import SwiftUI

struct Uploadajobacc: View {
    var body: some View {
            RoundedRectangle(cornerRadius: 20)
            .foregroundColor(.white)
                .frame(height: 140)
                .shadow(color: .gray, radius: 4, x: 0, y: 4)
                .overlay(
                    RoundedRectangle(cornerRadius: 16.5)
                        .foregroundColor(Color("logogreen"))
                        .frame(height: 130)
                        .padding(5)
                        .overlay(
                            VStack{
                                Text("Upload a Job")
                                    .font(.largeTitle)
                                    .fontWeight(.bold)
                                    .frame(width: 300, height: 38, alignment: .center)
                                    .foregroundColor(.white)
                                Text("Recieve Quotes instantly for free")
                                    .frame(width: 321, height: 24, alignment: .center)
                                    .font(.subheadline)
                                    .foregroundColor(.white)
                            }
                                .frame(height: 140, alignment: .leading)
                                .padding(20)
                            
                        )
                )
                
        }
    }
    


struct Uploadajobacc_Previews: PreviewProvider {
    static var previews: some View {
        Uploadajobacc()
    }
}
